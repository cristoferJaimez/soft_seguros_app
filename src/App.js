import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  TextField,
  Modal,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

function App() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://13.59.10.126:8000/get-csrf-token/', {
          withCredentials: true,
        });
        const data = response.data;
        console.log(data);
        const token = data.csrfToken;
        setCsrfToken(token);
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };

    fetchCsrfToken();
  }, []);


  const parseFechaCreacion = (fecha) => {
    const parts = fecha.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Restar 1 al mes porque en JavaScript los meses comienzan en 0 (enero = 0)
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };
  

  useEffect(() => {
    const filteredClientes = clientes.filter((cliente) => {
      const nombreCompletoMatch = cliente.nombre_completo.toLowerCase().includes(searchValue.toLowerCase());
  
      let fechaActualizadoMatch = false;
      try {
        const fechaActualizado = parseISO(cliente.fecha_actualizado);
        fechaActualizadoMatch = format(fechaActualizado, 'd MMM yyyy', { locale: es }).includes(searchValue.toLowerCase());
      } catch (error) {
        // Manejar el error de fecha inválida
        console.error('Error al analizar la fecha', error);
      }
  
      return nombreCompletoMatch || fechaActualizadoMatch;
    });
  
    setFilteredClientes(filteredClientes);
  }, [clientes, searchValue]);
  


  const fetchData = async () => {
    try {
      toast.info('Cargando registros...'); // Mostrar mensaje de carga

      const response = await axios.get('http://13.59.10.126:8000/lista/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });
      const data = response.data; 
      console.log(data); // Mostrar los datos en la consola

      const { elementos } = data; // Obtener la matriz de elementos
      setClientes(elementos); // Asignar la matriz de elementos a la variable de estado clientes
      setLoading(false); // Marcar la carga como completada

      if (elementos.length === 0) {
        toast.info('No hay registros para ver', { autoClose: 5000 }); // Mostrar el Toast por 5 segundos
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (id) => {
    try {
      setSelectedCliente(null); // Reset the selectedCliente state

      // Make an API call to fetch the client data based on the ID
      const response = await axios.get(`http://13.59.10.126:8000/editar/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
      });
      const data = response.data;


      // Convert the object data to an array
      const clienteArray = Object.values(data);
      console.log(clienteArray);
      // Set the fetched client data as the selectedCliente
      setSelectedCliente(clienteArray);
    } catch (error) {
      console.error('Error al obtener los datos del cliente:', error);
    }
  };


  


  const handleUpdateCliente = (id) => {
    // Verificar que selectedCliente tenga valores válidos
    if (!selectedCliente || selectedCliente.length === 0) {
      toast.error('No se ha seleccionado ningún cliente');
      return;
    }

    // Verificar que los campos de selectedCliente tengan valores válidos
    const { nombre_completo, numero_documento, email, fecha_nacimiento } = selectedCliente[0];
    if (!nombre_completo || !numero_documento || !email || !fecha_nacimiento) {
      toast.error('Por favor, complete todos los campos del cliente');
      return;
    }

    // Mostrar confirmación antes de actualizar el cliente
    const confirmResult = window.confirm('¿Estás seguro de que deseas actualizar el cliente?');
    if (!confirmResult) {
      return;
    }

    const clienteData = {
      nombre_completo: nombre_completo,
      numero_documento: numero_documento,
      email: email,
      fecha_nacimiento: fecha_nacimiento,
    };

    // Realizar la llamada a la API para actualizar los datos del cliente
    axios
      .put(`http://13.59.10.126:8000/actualizar/${id}/`, clienteData, {
        
      })
      .then((response) => {
        if (response.status === 200) {
          // Mostrar notificación de éxito
          toast.success('Cliente actualizado exitosamente');

          // Actualizar los datos del cliente en la lista
          const updatedClientes = clientes.map((cliente) =>
            cliente.id === selectedCliente[0].id ? selectedCliente[0] : cliente
          );
          setClientes(updatedClientes);
          setFilteredClientes(updatedClientes);

          // Cerrar el modal
          handleCloseModal();
        } else {
          // Mostrar notificación de error
          toast.error('Error al actualizar el cliente');
        }
      })
      .catch((error) => {
        // Mostrar notificación de error
        toast.error('Error al actualizar el cliente', error);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('¿Está seguro de que desea eliminar este cliente?');

    if (confirmDelete) {
      console.log(id);
      // Realizar la consulta a la API para eliminar el cliente con el ID proporcionado
      axios
        .put(`http://13.59.10.126:8000/eliminar/${id}/`, null, {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            // Mostrar notificación de éxito
            toast.success('Cliente eliminado exitosamente');

            // Eliminar el cliente de la lista
            const updatedClientes = clientes.filter((cliente) => cliente.id !== id);
            setClientes(updatedClientes);
            setFilteredClientes(updatedClientes);
          } else {
            // Mostrar notificación de error
            toast.error('Error al eliminar el cliente');
          }
        })
        .catch((error) => {
          // Mostrar notificación de error
          toast.error('Error al eliminar el cliente', error);
        });
    }
  };


  

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  const handleCloseModal = () => {
    setSelectedCliente(null);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" width="100%" sx={{ overflow: 'hidden' }}>
      <Box
        className="black30"
        sx={{
          backgroundColor: '#282c34',
          height: '40%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '10px',
        }}
      >
        <Typography
          variant="h5"
          className="title"
          sx={{
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            marginLeft: '15%',
          }}
        >
          Listado clientes
        </Typography>
        <Box sx={{ marginRight: '15%' }}>
          <Link to="/cliente/create" style={{ textDecoration: 'none' }}>
            <IconButton color="primary" size="small" disableRipple>
              <AddIcon />
              Nuevo cliente
            </IconButton>
          </Link>
        </Box>
      </Box>
      <Box
        className="white70"
        sx={{
          backgroundColor: 'white',
          height: '60%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <Card
          sx={{
            width: '80%',
            marginBottom: '10px',
            marginTop : '-8%',
            height: '400px', // Ajusta la altura según tus necesidades
            overflow: 'auto', // Activa el desplazamiento vertical
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <TextField
              label="Buscar por nombre"
              variant="outlined"
              value={searchValue}
              onChange={handleSearch}
              size="small"
              sx={{ width: '100%', marginRight: '10px' }}
            />
            <SearchIcon />
          </CardContent>
          {filteredClientes.length === 0 ? (
            <Box sx={{ textAlign: 'center', padding: '10px' }}>
              <Typography variant="h6" color="text.secondary">
                No hay registros disponibles
              </Typography>
              {searchValue && (
                <Typography variant="caption" color="text.secondary">
                  No se encontraron registros para la búsqueda: "{searchValue}"
                </Typography>
              )}
            </Box>
          ) : (
            <>
              {filteredClientes.map((cliente, index) => (
                <React.Fragment key={cliente.id}>
                  <CardContent
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt="Avatar"
                        src={cliente.avatarUrl}
                        sx={{ width: 60, height: 60, marginRight: 10 }}
                      >
                        {cliente.nombre_completo.slice(0, 2).toUpperCase()}
                      </Avatar>

                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                          {cliente.nombre_completo}
                        </Typography>
                        <Typography variant="caption">{cliente.email}</Typography>
                      </Box>
                    </Box>
                    <CardActions
                      sx={{ flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ display: 'inline-block', marginRight: '5px' }}
                        >
                          {new Date(cliente.fecha_nacimiento).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).replace(/(\w+)\s(\d+)$/, (_, month, year) => capitalizeFirstLetter(month) + ' ' + year)}
                        </Typography>

                        <Typography variant="caption" sx={{ display: 'inline-block', margin: '0 5px' }}>
                          |
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ display: 'inline-block', marginRight: '5px' }}
                        >
                          {new Date(cliente.fecha_creacion).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).replace(/(\w+)\s(\d+)$/, (_, month, year) => capitalizeFirstLetter(month) + ' ' + year)}
                        </Typography>
                      </Box>

                      <Box sx={{ marginLeft: '10px' }}>
                        <IconButton
                          color="primary"
                          size="small"
                          data-id={cliente.id}
                          onClick={() => handleEdit(cliente.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          data-id={cliente.id}
                          onClick={() => handleDelete(cliente.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </CardContent>
                  {index !== filteredClientes.length - 1 && (
                    <Divider
                      sx={{
                        backgroundColor: '#282c34',
                        margin: 'auto',
                        filter: 'blur(0.2px)',
                        width: '90%',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </Card>
      </Box>

      <ToastContainer position="bottom-left" />
      {selectedCliente && (
        <Modal open={Boolean(selectedCliente)} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography variant="h6">Editar cliente</Typography>

            {selectedCliente && (
              <>
                <TextField
                  label="Nombre completo"
                  value={selectedCliente[0].nombre_completo}
                  onChange={(event) => {
                    setSelectedCliente((prevData) => ([{ ...prevData[0], nombre_completo: event.target.value }, ...prevData.slice(1)]));
                  }}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Número de documento"
                  value={selectedCliente[0].numero_documento}
                  onChange={(event) => {
                    setSelectedCliente((prevData) => ([{ ...prevData[0], numero_documento: event.target.value }, ...prevData.slice(1)]));
                  }}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Email"
                  value={selectedCliente[0].email}
                  onChange={(event) => {
                    setSelectedCliente((prevData) => ([{ ...prevData[0], email: event.target.value }, ...prevData.slice(1)]));
                  }}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Fecha de nacimiento"
                  type="text"
                  value={selectedCliente[0].fecha_nacimiento}
                  onChange={(event) => {
                    setSelectedCliente((prevData) => ([{ ...prevData[0], fecha_nacimiento: event.target.value }, ...prevData.slice(1)]));
                  }}
                  fullWidth
                  margin="normal"
                />

                {/* Add more fields for other client data */}
              </>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={() => handleUpdateCliente(selectedCliente[0].id)}>
                Actualizar
              </Button>
            </Box>
          </Box>
        </Modal>



      )}
    </Box>
  );
}

export default App;
