import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const filteredClientes = searchValue
      ? clientes.filter((cliente) =>
        cliente.nombre_completo.toLowerCase().includes(searchValue.toLowerCase())
      )
      : clientes;
    setFilteredClientes(filteredClientes);
  }, [clientes, searchValue]);

  useEffect(() => {
    // Mostrar mensaje de carga
    toast.info('Registros Cargados...', { autoClose: false });

    // Realizar la llamada a la API y obtener los datos
    fetch('http://13.59.10.126:8000/lista/')
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Mostrar los datos en la consola
        const { elementos } = data; // Obtener la matriz de elementos
        setClientes(elementos); // Asignar la matriz de elementos a la variable de estado clientes
        setLoading(false); // Marcar la carga como completada

        if (elementos.length === 0) {
          toast.info('No hay registros para ver', { autoClose: 5000 }); // Mostrar el Toast por 5 segundos
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const handleEdit = (id) => {
    // Realizar la consulta a la API para editar el cliente con el ID proporcionado
    console.log(`Editar cliente con ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Realizar la consulta a la API para eliminar el cliente con el ID proporcionado
    console.log(`Eliminar cliente con ID: ${id}`);
  };

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
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
          <IconButton color="primary" size="small" disableRipple>
            <AddIcon />
            Nuevo cliente
          </IconButton>
        </Box>
      </Box>
      <Box
        className="white70"
        sx={{
          backgroundColor: 'white',
          height: '60%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        {loading ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary">
              Cargando registros...
            </Typography>
          </Box>
        ) : (
          <>
            {filteredClientes.length === 0 ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="text.secondary">
                  No hay registros disponibles
                </Typography>
                <AddIcon sx={{ fontSize: 128, color: 'text.disabled', marginTop: '24px' }} />
              </Box>
            ) : (
              <Card
                sx={{
                  width: '80%',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <TextField
                      label="Buscar por nombre"
                      variant="outlined"
                      value={searchValue}
                      onChange={handleSearch}
                      size="small"
                      sx={{ marginRight: '10px', width: '100%' }}
                    />
                    <SearchIcon />
                  </Box>

                </CardContent>
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
              </Card>
            )}
          </>
        )}
      </Box>

      <ToastContainer position="bottom-left" />
    </Box>
  );
}

export default App;
