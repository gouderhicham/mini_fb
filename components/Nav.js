import Link from "next/link";
import { AppContext } from "../lib/ContextNext";
import { useContext } from "react";
import { SignOutButton } from "../pages/enter";
import Image from "next/image";
const Nav = () => {
  let { profileuser } = useContext(AppContext);
  return (
    <nav className="navbar">
      <ul>
        <li className="feed">
          <Link href={"/"}>
            <button className="btn-logo">MINI FB</button>
          </Link>
        </li>
        {profileuser?.username && (
          <>
            <li>
              <Link href={"/admin"}>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <div style={{ display: "flex", alignItems: "center" }}>
              <li>
                <SignOutButton />
              </li>
              <li>
                <Link href={`/${profileuser?.username}`}>
                  <div className="label">
                    <span
                      className="tooltip-toggle"
                      aria-label={profileuser?.username}
                      tabIndex="0"
                    >
                      {profileuser?.photoURL && (
                        <Image
                          className="svg"
                          src={profileuser?.photoURL}
                          height={50}
                          width={50}
                        />
                      )}
                    </span>
                  </div>
                </Link>
              </li>
            </div>
          </>
        )}
        {!profileuser?.username && (
          <>
            <li>
              <Link href={"/enter"}>
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
