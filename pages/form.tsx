import { GetServerSideProps } from "next";

export default function Form(props: { props: any }) {
  return (
    <div className="container">
      <form action="/api/addMedecin" method="post">
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">FirstName</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="first"
              name="first"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">LastName</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="last" name="last" />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Phone</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Specialité</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="spe" name="spe" />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">City</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="ville"
              name="ville"
            />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Tarif/Heure</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="tarif"
              name="tarif"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-md btn-primary"
          data-toggle="popover"
          title="Popover title"
          data-content="And here's some amazing content. It's very engaging. Right?"
        >
          Sign it
        </button>
      </form>
    </div>
  );
}
