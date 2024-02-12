import "../styles/headers.css";
import { SiGithub } from "react-icons/si";
export default function Footer() {
  return (
    <div>
      <hr
        style={{
          background: "#6f2232",
          color: "#6f2232",
          borderColor: "#6f2232",
          height: "2px",
        }}
      />
      <div className="footerstyles">
        <div>
          <span
            style={{ fontSize: "20px", color: "#c3073f", fontWeight: "500" }}
            className="copyrights"
          >
            &copy; REALM CLASH {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex text-center items-center">
          <div className="" style={{ fontSize: "17px", fontWeight: "300" }}>
            <span>Built by 0xProf </span>
          </div>
          <div>
            <a
              target={"_blank"}
              rel="noreferrer"
              href="https://github.com/0xpr0f/realmclash"
            >
              <SiGithub size={20} fill="#4e4e50" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
