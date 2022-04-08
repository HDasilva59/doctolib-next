import GfgDatePicker from "./DataPicker";

export const DisponibilityForm: React.FC = () => {
  return (
    <div className="container">
      <form action="/api/addDisponibility" method="POST">

          <input type="datetime-local" name="data" id="data"/>

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
