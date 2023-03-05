import Link from "next/link";
import { AppContext } from "../lib/ContextNext";
import { useContext, useState, useEffect } from "react";
import Image from "next/image";
const Nav = () => {
  const [isLoading, setIsLoading] = useState(true);
  let { profileuser } = useContext(AppContext);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [profileuser]);

  return (
    <nav className="navbar">
      <ul>
        {searchClicked && <input type="text" className={`search_input`} />}
        {!searchClicked && (
          <li className="feed">
            <Link href={"/"} prefetch={false}>
              <button className="btn-logo">MINI FB</button>
            </Link>
          </li>
        )}
        {isLoading && <div className="loading">Loading...</div>}
        {profileuser?.username && (
          <>
            {!searchClicked && (
              <li>
                <Link prefetch={false} href={"/admin"}>
                  <button className="btn-blue post">Post</button>
                </Link>
              </li>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => {
                  setSearchClicked((old) => !old);
                }}
                className="btn-search"
              >
                <Image
                  src="/search.png"
                  height={25}
                  width={25}
                  loading="lazy"
                />
              </div>
              <li>
                <a prefetch={false} href={`/${profileuser?.username}`}>
                  <div className="label">
                    <span
                      className="tooltip-toggle"
                      aria-label={profileuser?.username}
                      tabIndex="0"
                    >
                      {profileuser?.photoURL && (
                        <Image
                          className="profile-pic"
                          loading="eager"
                          src={profileuser?.photoURL}
                          height={50}
                          width={50}
                          objectFit="cover"
                        />
                      )}
                    </span>
                  </div>
                </a>
              </li>
            </div>
          </>
        )}

        {!profileuser?.username && (
          <>
            <li>
              <Link prefetch={false} href={"/signin"}>
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
