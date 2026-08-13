import { useParams } from "react-router-dom";
import ProjectTemplate from "../components/ProjectTemplate";
import ProjectNotFound from "../components/ProjectNotFound";
import { useProjects } from "../context/ProjectsContext";

export default function SingleProject() {
  const { id } = useParams();
  const { projects, loading } = useProjects();

  // Avoid flashing "Not Found" while the server response is still in-flight.
  if (loading) return null;

  const project = projects.find((p) => p.id === Number(id));
  if (!project) return <ProjectNotFound />;

  return <ProjectTemplate project={project} />;
}
