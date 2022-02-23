import { ERole } from "../../types/Enums/Erole";
import { ERoleUserProject } from "../../types/Enums/ERoleUserProject";

const isAuthorized = (
  userRole: ERole,
  userRoleInProject?: ERoleUserProject,
) => {
  const userProjectsRoles = [ERoleUserProject.AUTHOR, ERoleUserProject.PO];
  return (
    userProjectsRoles.includes(userRoleInProject) || userRole === ERole.ADMIN
  );
};

export default isAuthorized;
