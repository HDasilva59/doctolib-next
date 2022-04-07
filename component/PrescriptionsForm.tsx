export const PrescriptionsForm = (props:any) => {
  return (
    <div className="container">
      <form action={`/api/addPrescription?id=${props.idPatient}`} method="POST">
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">Date Of Prescription </label>
          <div className="col-sm-10">
            <input type="text" className="form-control" value={props.date} id="date" name="date" />
          </div>
        </div>
        <div className="row mb-3">
          <label className="col-sm-2 col-form-label">N° Reservation</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" value={props.resa} id="resa" name="resa" />
          </div>
        </div>
        <div className="row mb-3">
          <label className="form-label">Message</label>
          <textarea
            className="form-control"
            id="formArea"
            name="formArea"
          ></textarea>
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
};
