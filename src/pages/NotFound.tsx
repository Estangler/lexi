import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  function handleNavigate() {
    navigate("/");
  }
  return (
    <div>
      <h1>Se perdeu?</h1>
      <button onClick={handleNavigate}>Caminho de volta</button>
    </div>
  );
}
