import { ERole, ERoleUserProject } from "../../types/ERolesEnum";

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
