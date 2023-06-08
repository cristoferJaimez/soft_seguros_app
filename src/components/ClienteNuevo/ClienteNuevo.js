import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import {resetForm } from 'formik';


const validationSchema = yup.object({
  nombre_completo: yup.string().required('Nombre Completo es requerido'),
  numero_documento: yup
    .number()
    .typeError('Número de Documento debe ser un número')
    .required('Número de Documento es requerido'),
  email: yup.string().email('Email inválido').required('Email es requerido'),
  fecha_nacimiento: yup.string().required('Fecha de Nacimiento es requerida'),
});

function ClienteNuevo() {
  const formik = useFormik({
    initialValues: {
      nombre_completo: '',
      numero_documento: '',
      email: '',
      fecha_nacimiento: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .post('http://127.0.0.1:8000/crear/', values)
        .then((response) => {
          toast.success('Formulario enviado');
          
        })
        .catch((error) => {
          console.log(error);
          toast.error('Error al enviar el formulario');
        });
    },
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100%"
      sx={{ overflow: 'hidden' }}
    >
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
          Nuevo cliente
        </Typography>
        <Box sx={{ marginRight: '15%' }}>
          <Link to="/cliente/list" style={{ textDecoration: 'none' }}>
            <IconButton color="primary" size="small" disableRipple>
              <AddIcon />
              Listado de cliente
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
        <Card sx={{ width: '80%', marginBottom: '10px', marginTop: '-8%' }}>
          <CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                <Box display="flex" marginBottom="10px">
                  <TextField
                    label="Nombre Completo"
                    variant="outlined"
                    fullWidth
                    name="nombre_completo"
                    id="nombre_completo"
                    margin="normal"
                    {...formik.getFieldProps('nombre_completo')}
                    error={formik.touched.nombre_completo && formik.errors.nombre_completo}
                    helperText={formik.touched.nombre_completo && formik.errors.nombre_completo}
                    sx={{ marginLeft: '10px', width: '80%' }}
                  />
                  <TextField
                    label="Número de Documento"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="numero_documento"
                    id="numero_documento"
                    {...formik.getFieldProps('numero_documento')}
                    error={formik.touched.numero_documento && formik.errors.numero_documento}
                    helperText={formik.touched.numero_documento && formik.errors.numero_documento}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    sx={{ marginLeft: '10px', width: '40%' }}
                  />
                </Box>
                <Box display="flex" marginBottom="10px">
                  <TextField
                    label="Fecha de Nacimiento"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="fecha_nacimiento"
                    id="fecha_nacimiento"
                    {...formik.getFieldProps('fecha_nacimiento')}
                    error={formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento}
                    helperText={formik.touched.fecha_nacimiento && formik.errors.fecha_nacimiento}
                    sx={{ marginLeft: '10px', width: '40%' }}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="email"
                    id="email"
                    {...formik.getFieldProps('email')}
                    error={formik.touched.email && formik.errors.email}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ marginLeft: '10px', width: '80%' }}
                  />
                </Box>
                <Divider />
                <Box display="flex" justifyContent="flex-end" marginTop="10px">
                  <Button variant="outlined" color="primary" sx={{ marginRight: '10px' }}>
                    Cancelar
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Guardar
                  </Button>
                </Box>
              </form>
            </CardActions>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer position="bottom-left" />
    </Box>
  );
}

export default ClienteNuevo;
