import isAuthorized from "../helpers/auth/isAuthorized";
import { ERole, ERoleUserProject } from "../types/ERolesEnum";

test("isAuthorized", async () => {
  expect(isAuthorized(ERole.DEV, ERoleUserProject.PO)).toBeTruthy();
});
