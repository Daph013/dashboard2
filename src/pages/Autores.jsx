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

const Autores = () => {
  const [datos, setDatos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [autor, setAutor] = useState({ idtipousuario: '', nombre: '', correo: '', clave: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [autorToDelete, setAutorToDelete] = useState(null);
  const toast = useRef(null);

  const API         = 'http://localhost/musicback/api/autor/getAutorBack.php';
  const POST_API    = 'http://localhost/musicback/api/autor/postautor.php';
  const UPDATE_API  = 'http://localhost/musicback/api/autor/updateautor.php';
  const DELETE_API  = 'http://localhost/musicback/api/autor/deleteautor.php';

  const tiposUsuario = [
    { label: 'Administrador', value: '1' },
    { label: 'Operador', value: '2' },
    { label: 'Usuario', value: '3' }
  ];

  useEffect(() => {
    fetchDatos();
  }, []);






  const fetchDatos = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setDatos(data);
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
    setAutor({ idtipousuario: '', nombre: '', correo: '', clave: '' });
    setIsEditing(false);
    setVisible(true);
  };

  const editAutor = (autor) => {
    setAutor(autor);
    setIsEditing(true);
    setVisible(true);
  };

  const saveAutor = async (event) => {
    event.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${UPDATE_API}?id=${autor.id}` : POST_API;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(autor),
      });
      const result = await response.json();

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: `Autor ${isEditing ? 'actualizado' : 'agregado'} correctamente.`, life: 3000 });
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
    setAutorToDelete(id);
    setConfirmDeleteVisible(true);
  };

  const deleteAutor = async () => {
    try {
      const response = await fetch(`${DELETE_API}?id=${autorToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Autor eliminado correctamente.', life: 3000 });
        fetchDatos();
      } else {
        toast.current.show({ severity: 'error', summary: 'Error', detail: result.message || 'Error desconocido', life: 3000 });
      }
    } catch (error) {
      console.error('Error al eliminar el autor:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el autor.', life: 3000 });
    } finally {
      setConfirmDeleteVisible(false);
      setAutorToDelete(null);
    }
  };

  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text text-white" />
      <Button label="Grabar" icon="pi pi-check" onClick={saveAutor}  className='btn btn-outline-success'/>
    </div>
  );

  return (
    <main className='main-container'>
      <Toast ref={toast} />
      <h4 className='text-center'>Autores</h4>
      <div className='d-flex justify-content-end'>
          <Button label="Agregar un Autor" icon="pi pi-plus" onClick={openNew} className='btn btn-outline-info my-3' />
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
        <Column field="nombre" header="Nombre" sortable />
        <Column field="estatus" header="Estatus" sortable />
        <Column field="tipousuario" header="Tipo" sortable />
        <Column field="correo" header="Correo" sortable />
        <Column field="clave" header="Clave" />
        <Column 
          header="Acciones" 
          body={(rowData) => (
              <>
                  <Button icon="pi pi-pencil" onClick={() => editAutor(rowData)} className='btn btn-outline-primary me-2'> Editar</Button>
                  <Button icon="pi pi-trash" onClick={() => confirmDelete(rowData.id)} className='btn btn-outline-danger'> Eliminar</Button>
              </>
          )} 
    headerStyle={{ textAlign: 'center' }} // Centrar el título
    bodyStyle={{ textAlign: 'center' }} // Centrar el contenido de la columna
/>
      </DataTable>

      <Dialog header="Editar Autor" visible={visible} footer={footer} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
        <form className="p-fluid">
          <div className="mb-3">
            <label htmlFor="idtipousuario" className="form-label">Tipo de Usuario</label>
            <Dropdown
              id="idtipousuario"
              value={autor.idtipousuario}
              options={tiposUsuario}
              onChange={(e) => setAutor({ ...autor, idtipousuario: e.value })}
              placeholder="Seleccione un tipo de usuario"
              className="w-full"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <InputText
              id="nombre"
              className="w-full"
              value={autor.nombre}
              onChange={(e) => setAutor({ ...autor, nombre: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="correo" className="form-label">Correo</label>
            <InputText
              type="email"
              id="correo"
              className="w-full"
              value={autor.correo}
              onChange={(e) => setAutor({ ...autor, correo: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="clave" className="form-label">Clave</label>
            <InputText
              type='password'
              id="clave"
              className="w-full"
              value={autor.clave}
              onChange={(e) => setAutor({ ...autor, clave: e.target.value })}
            />
          </div>
        </form>
      </Dialog>

      <Dialog header="Confirmar Eliminación" visible={confirmDeleteVisible} footer={
        <div>
          <Button label="No" icon="pi pi-times" onClick={() => setConfirmDeleteVisible(false)}  className="p-button-text text-white"/>
          <Button label="Sí" icon="pi pi-check" onClick={deleteAutor} className='btn btn-outline-danger' />
        </div>
      } onHide={() => setConfirmDeleteVisible(false)}>
        <p>¿Estás seguro de que deseas eliminar este autor? Esta acción no se puede deshacer.</p>
      </Dialog>
    </main>
  );
};

export default Autores;