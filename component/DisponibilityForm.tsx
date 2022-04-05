import Link from "next/link";

export const DisponibilityForm: React.FC = () => {
  return (
    <div>
      <form action="/api/addDisponibility" method="POST">
        <label>Date</label>
        <input id="date" name="date" type="text" required />
        <label>Heure</label>
        <input id="heure" name="heure" type="text" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
