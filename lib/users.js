import Userjob from "@/schema/User";
import Userjobrec from "@/schema/UserJobrec";

/** Candidate and recruiter accounts live in separate collections. */
export const userModelFor = (role) => (role === "recruiter" ? Userjobrec : Userjob);
