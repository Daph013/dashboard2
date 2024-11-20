import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

// para el filtro
import { FilterMatchMode} from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
//import { InputText } from 'primereact/inputtext';


const Canciones = () => {

  const [datos, setDatos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [visible, setVisible] = useState(false);
  const [canciones, setCanciones] = useState({ idautor: '',idgenero: '', interprete: '', titulo: '', url:'' });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [cancionToDelete, setCancionToDelete] = useState(null);
  const toast = useRef(null);

  //Api para datos 
  const API       = 'http://localhost/musicback/api/cancion/getCancion.php';
  const API2       = 'http://localhost/musicback/api/autor/getAutor.php';
  const API3       = 'http://localhost/musicback/api/genero/getGenero.php';

  //Acciones
  const POST_API  = 'http://localhost/musicback/api/cancion/postCancion.php';
  const UPDATE_API  = 'http://playlist3.test/back/api/autor/updateautor.php';
  const DELETE_API = 'http://localhost/musicback/api/cancion/deleteCancion.php';

  const tiposUsuario = [
    { label: 'Administrador', value: '1' },
    { label: 'Operador', value: '2' },
    { label: 'Usuario', value: '3' }
  ];

  useEffect(() => {
    fetchDatos();
    fetchAutores();
    fetchGeneros();
  }, []);

  const fetchDatos = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setDatos(data);
  };
  const fetchAutores = async () => {
    try {
        const response = await fetch(API2);
        if (!response.ok) {
            throw new Error('Error al cargar autores');
        }
        const data = await response.json();
        
        // Transformar los datos a la estructura requerida para el Dropdown
        const formattedData = data.map(autor => ({
            label: autor.nombre, // Cambia 'nombre' si tu propiedad tiene otro nombre
            value: autor.id // Cambia 'id' si tu propiedad tiene otro nombre
        }));
        
        setAutores(formattedData);
    } catch (error) {
        console.error('Error al cargar autores:', error);
    }
};
const fetchGeneros = async () => {
  try {
      const response = await fetch(API3);
      if (!response.ok) {
          throw new Error('Error al cargar generos');
      }
      const data = await response.json();
      
      // Transformar los datos a la estructura requerida para el Dropdown
      const formattedData = data.map(genero => ({
          label: genero.nombre, // Cambia 'nombre' si tu propiedad tiene otro nombre
          value: genero.id // Cambia 'id' si tu propiedad tiene otro nombre
      }));
      
      setGeneros(formattedData);
  } catch (error) {
      console.error('Error al cargar generos:', error);
  }
};
  

  // para el filtro
const [globalFilterValue, setGlobalFilterValue] = useState('');
const [filters, setFilters] = useState({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
 });
 const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
};

  const openNew = () => {
    setCanciones({idautor: '',idgenero: '', interprete: '', titulo: '' ,url:'', });
    setIsEditing(false);
    setVisible(true);
  };

  const editCancion = (canciones) => {
    setCanciones(canciones);
    setIsEditing(true);
    setVisible(true);
  };

  const saveCancion = async (event) => {
    event.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${UPDATE_API}?id=${canciones.id}` : POST_API;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(canciones),
      });
      const result = await response.json();

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Cancion ${isEditing ? 'actualizado' : 'agregado'} correctamente.`, life: 3000 });
        setVisible(false);
        fetchDatos();
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar los datos.', life: 3000 });
    }
  };

  const confirmDelete = (id) => {
    setCancionToDelete(id);
    setConfirmDeleteVisible(true);
    console.log(id)
  };

  const deleteCancion = async () => {
    try {
      const response = await fetch(`${DELETE_API}?id=${cancionToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cancion eliminada correctamente.', life: 3000 });
        fetchDatos();
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
      }
    } catch (error) {
      console.error('Error al eliminar el cancion:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la cancion.', life: 3000 });
    } finally {
      setConfirmDeleteVisible(false);
      setCancionToDelete(null);
    }
  };
  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text text-white" />
      <Button label="Grabar" icon="pi pi-check" onClick={saveCancion}  className='btn btn-outline-success'/>
    </div>
  );

  //console.log(openNew)
  return (
    <main className='main-container'>
      <Toast ref={toast} />
      <h4 className='text-center'>Canciones</h4>
      <div className='d-flex justify-content-end'>
          <Button label="Agregar una cancion" icon="pi pi-plus" onClick={openNew} className='btn btn-outline-success my-3' />
      </div>
      <div className="d-flex justify-content-end py-2 gap-2">
          <IconField iconPosition="">
              <InputIcon className="pi pi-search " />
              <InputText className='px-4' value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Filtrar por "  />
          </IconField>
      </div>



      <DataTable 
      value={datos} 
      filters={filters}
      paginator rows={10}
      rowsPerPageOptions={[5, 10, 25, 50]}
       >
        <Column field="id" header="ID" sortable />
        <Column field="titulo" header="Titulo" sortable />
        <Column field="interprete" header="Interprete" sortable />
        <Column field="genero" header="Genero" sortable />
        <Column field="autor" header="Autor" sortable />
        <Column field="url" header="URl Video" />
        <Column 
          header="Acciones" 
          body={(rowData) => (
              <>
                  <Button icon="pi pi-pencil" onClick={() => editCancion(rowData)} className='btn btn-outline-warning btn-sm mb-2'> Editar</Button>
                  <Button icon="pi pi-trash" onClick={() => confirmDelete(rowData.id)} className='btn btn-outline-danger btn-sm'> Eliminar</Button>
              </>
          )} 
    headerStyle={{ textAlign: 'center' }} // Centrar el título
    bodyStyle={{ textAlign: 'center' }} // Centrar el contenido de la columna
/>
      </DataTable>

      <Dialog header="Editar Cancion" visible={visible} footer={footer} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
        <form className="p-fluid">
          <div className="mb-3">
            <label htmlFor="idautor" className="form-label">Autor</label>
            <Dropdown
              id="idautor"
              value={autores.id}
              options={autores}
              onChange={(e) => setCanciones({ ...canciones, idautor: e.value })}
              placeholder="Seleccione un Autor"
              className="w-full"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="idgenero" className="form-label">Genero</label>
            <Dropdown
              id="idgenero"
              value={canciones.idgenero}
              options={generos}
              onChange={(e) => setCanciones({ ...canciones, idgenero: e.value })}
              placeholder="Seleccione un Genero"
              className="w-full"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">Titulo</label>
            <InputText
              id="titulo"
              className="w-full"
              value={canciones.nombre}
              onChange={(e) => setCanciones({ ...canciones, titulo: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="interprete" className="form-label">Interprete</label>
            <InputText
              id="interprete"
              className="w-full"
              value={canciones.interprete}
              onChange={(e) => setCanciones({ ...canciones, interprete: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="url" className="form-label">URL</label>
            <InputText
              type="url"
              id="url"
              className="w-full"
              placeholder="https://www.youtube.com/watch?v=..."
              value={canciones.url}
              onChange={(e) => setCanciones({ ...canciones, url: e.target.value })}
            />
          </div>
        </form>
      </Dialog>

      <Dialog header="Confirmar Eliminación" visible={confirmDeleteVisible} footer={
        <div>
          <Button label="No" icon="pi pi-times" onClick={() => setConfirmDeleteVisible(false)}  className="p-button-text text-white"/>
          <Button label="Sí" icon="pi pi-check" onClick={deleteCancion} className='btn btn-outline-danger' />
        </div>
      } onHide={() => setConfirmDeleteVisible(false)}>
        <p>¿Estás seguro de que deseas eliminar esta cancion? Esta acción no se puede deshacer.</p>
      </Dialog>
    </main>
  )
}

export default Canciones