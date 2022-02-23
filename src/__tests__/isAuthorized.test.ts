import isAuthorized from "../helpers/auth/isAuthorized";
import { ERole } from "../types/Enums/Erole";
import { ERoleUserProject } from "../types/Enums/ERoleUserProject";

test("isAuthorized", async () => {
  expect(isAuthorized(ERole.DEV, ERoleUserProject.PO)).toBeTruthy();
});
