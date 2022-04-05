import Link from "next/link";

export const DisponibilityForm: React.FC = () => {
  return (
    <div className="container">
      <form action="/api/addDisponibility" method="POST">
  <div className="row mb-3">
    <label className="col-sm-2 col-form-label">Date</label>
    <div className="col-sm-10">
      <input type="text" className="form-control" id="date" name="date" />
    </div>
  </div>
  <div className="row mb-3">
    <label className="col-sm-2 col-form-label">Heure</label>
    <div className="col-sm-10">
      <input type="text" className="form-control" id="heure" name="heure" />
    </div>
        </div>
  <button type="submit" className="btn btn-md btn-primary" data-toggle="popover" title="Popover title" data-content="And here's some amazing content. It's very engaging. Right?">Sign it</button>
</form>
    </div>
  );
};

