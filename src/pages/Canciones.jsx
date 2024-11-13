import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
const Canciones = () => {
  const [datos, setDatos] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cancion, setCancion] = useState({idautor:'', autor:'', Titulo: '', interprete: '', genero:'', });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [cancionToDelete, setCancionToDelete] = useState(null);
  const toast = useRef(null);

  const API         = 'http://localhost/musicback/api/canciones/getCancion.php';
  const POST_API    = 'http://localhost/musicback/api/cancion/postcancion.php';
  const UPDATE_API  = 'http://localhost/musicback/api/cancion/updatecancion.php';
  const DELETE_API  = 'http://localhost/musicback/api/cancion/deletecancion.php';
  
  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setDatos(data);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al obtener los datos.', life: 3000 });
    }
  };

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
    setCancion({ Titulo: '' });
    setIsEditing(false);
    setVisible(true);
  };

  const editCancion = (rowData) => {
    setCancion(rowData);
    setIsEditing(true);
    setVisible(true);
  };

  const saveCancion = async (event) => {
    event.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${UPDATE_API}?id=${cancion.id}` : POST_API;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancion),
      });
      console.log(cancion)
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
      console.error('Error al eliminar la cancion:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la cancion.', life: 3000 });
    } finally {
      setConfirmDeleteVisible(false);
      setCancionToDelete(null);
    }
  };

  const footer = (
    <div>
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text text-white" />
      <Button label="Grabar" icon="pi pi-check" onClick={saveCancion} className='btn btn-outline-success' />
    </div>
  );

  return (
    <main className='main-container'>
      <Toast ref={toast} />
      <div className='col-md-7 mx-auto'>
        <h4 className='text-center'>Canciones</h4>
        <div className='d-flex justify-content-center'>
          <Button label="Agregar una cancion" icon="pi pi-plus" onClick={openNew} className='btn btn-outline-info my-3' />
        </div>
        <div className="d-flex justify-content-center py-3">

          <IconField iconPosition=" ">
          
            <InputIcon className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Filtrar por " className="w-full px-4" />
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
          <Column field="url" header="URL" sortable />
          <Column className='text-center' header="Acciones" body={(rowData) => (
            <>
              <Button icon="pi pi-pencil" onClick={() => editCancion(rowData)} className='btn btn-outline-success me-2'> Editar</Button>
              <Button icon="pi pi-trash" onClick={() => confirmDelete(rowData.id)} className='btn btn-outline-danger'> Eliminar</Button>
            </>
          )} />
        </DataTable>
        <Dialog header="Editar Cancion" visible={visible} footer={footer} onHide={() => setVisible(false)} style={{ width: '50vw' }}>
          <form className="p-fluid">
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">Titulo</label>
              <InputText
                id="nombre"
                className="w-full"
                value={cancion.Titulo}
                onChange={(e) => setCancion({ ...cancion, nombre: e.target.value })}
              />
              <hr />
                  <label htmlFor="interprete" className="form-label">Interprete</label>
              <InputText
                id="interprete"
                className="w-full"
                value={cancion.interprete}
                onChange={(e) => setCancion({ ...cancion, Interprete: e.target.value })}
              />
              <hr />
              <label htmlFor="url" className="form-label">Link de YouTube</label>
              <InputText
                id="url"
                className="w-full"
                value={cancion.url}
                onChange={(e) => setCancion({ ...cancion, Interprete: e.target.value })}
              />
              <hr />
      
              
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
      </div>
    </main>
  );
}
  


export default Canciones