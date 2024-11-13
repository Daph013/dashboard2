import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

const Autores = () => {
  const [autores, setAutores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [autor, setAutor] = useState({ idtipousuario: '', nombre: '', correo: '', clave: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [autorToDelete, setAutorToDelete] = useState(null);
  const toast = useRef(null);

  const API = 'http://playlist3.test/back/api/autor/getAutorBack.php';
  const POST_API = 'http://playlist3.test/back/api/autor/postautor.php';

  const tiposUsuario = [
    { label: 'Administrador', value: '1' },
    { label: 'Operador', value: '2' },
    { label: 'Usuario', value: '3' }
  ];

  useEffect(() => {
    fetchAutores();
  }, []);

  const fetchAutores = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setAutores(data);
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
    const url = isEditing ? `http://playlist3.test/back/api/autor/updateautor.php?id=${autor.id}` : POST_API;

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
        fetchAutores();
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
      const response = await fetch(`http://playlist3.test/back/api/autor/deleteautor.php?id=${autorToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Autor eliminado correctamente.', life: 3000 });
        fetchAutores();
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
      <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)} />
      <Button label="Save" icon="pi pi-check" onClick={saveAutor} />
    </div>
  );

  return (
    <main className='main-container'>
      <Toast ref={toast} />
      <h4 className='text-center'>Autores</h4>
      <Button label="New Autor" icon="pi pi-plus" onClick={openNew} />
      <DataTable value={autores} paginator rows={10}>
        <Column field="id" header="ID" sortable />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="estatus" header="Estatus" sortable />
        <Column field="tipousuario" header="Tipo" sortable />
        <Column field="correo" header="Correo" sortable />
        <Column field="clave" header="Clave" />
        <Column body={(rowData) => (
          <>
            <Button icon="pi pi-pencil" onClick={() => editAutor(rowData)} />
            <Button icon="pi pi-trash" onClick={() => confirmDelete(rowData.id)} />
          </>
        )} />
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
          <Button label="No" icon="pi pi-times" onClick={() => setConfirmDeleteVisible(false)} />
          <Button label="Sí" icon="pi pi-check" onClick={deleteAutor} />
        </div>
      } onHide={() => setConfirmDeleteVisible(false)}>
        <p>¿Estás seguro de que deseas eliminar este autor? Esta acción no se puede deshacer.</p>
      </Dialog>
    </main>
  );
};

export default Autores;