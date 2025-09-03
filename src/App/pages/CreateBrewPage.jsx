import axios from "axios";
import { useNavigate } from "react-router-dom";


export const CreateBrewPage = () => {
  const navigate = useNavigate();

  const createBrew = async (e) => {
    // Handle brew creation logic here
    e.preventDefault();
    const formData = new FormData();
    const name = e.target.name.value;
    const style = e.target.style.value;
    const abv = e.target.abv.value;
    const srm = e.target.srm.value;
    const ibu = e.target.ibu.value;
    const ml = e.target.ml.value;
    const price = e.target.price.value;
    const description = e.target.description.value;
    const image = e.target.image.files[0];
    const id_user = localStorage.getItem('id_user');
    // const secondaryImages = e.target.secondaryImages.files;

    formData.append('name', name);
    formData.append('style', style);
    formData.append('abv', abv);
    formData.append('srm', srm);
    formData.append('ibu', ibu);
    formData.append('ml', ml);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('id_user', id_user);
    // for (let i = 0; i < secondaryImages.length; i++) {
    //   formData.append('secondaryImages', secondaryImages[i]);
    // }

    try {

      const response = await axios.post('http://localhost:8000/brews/create_brew', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data.message);
      navigate('/be/home-provider');
    }catch (error) {
      console.error("Error creating brew:", error.response.data);
      const errorMessage = error.response.data.detail || 'Error desconocido al crear la cerveza.';

      alert(errorMessage);
    }

  }


  return (
    <div>
      <h1>Registrar nueva cerveza</h1>
      <form onSubmit={(e) => createBrew(e)}>
        <div>
          <label>Nombre de Cerveza:</label>
          <input type="text" name="name" placeholder="Nombre de Cerveza" required/>
        </div>
        <div>
          <label>Estilo:</label>
          <input type="text" name="style" placeholder="Estilo de Cerveza" required />
        </div>
        <div>
          <label>ABV:</label>
          <input type="number" step="0.1" name="abv" placeholder="Grado Alcohólico" required />
        </div>
        <div>
          <label>SRM:</label>
          <input type="number" step="0.1" name="srm" placeholder="Referencia de Color" required />
        </div>
        <div>
          <label>IBU:</label>
          <input type="number" step="0.1" name="ibu" placeholder="Amargor" required />
        </div>
        <div>
          <label>ml:</label>
          <input type="number" name="ml" placeholder="Mililitros" required />
        </div>
        <div>
          <label>Precio:</label>
          <input type="number" step="0.01" name="price" placeholder="Precio" required />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea name="description" placeholder="Descripción de la Cerveza" required />
        </div>
        <div>
          <label>Imagen:</label>
          <input type="file" name="image" required />
        </div>
        {/* <div>
          <label>id_user:</label>
          <input name="id_user" value={localStorage.getItem('id_user')} readOnly />
        </div> */}
        {/* <div>
          <label>Secondary Images:</label>
          <input type="file" name="secondaryImages" accept="image/*" multiple />
        </div> */}
        <button type="submit">Registrar Cerveza</button>
      </form>
    </div>
  );
}