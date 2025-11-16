import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  let currentPath = "";
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <nav style={{ margin: "0", fontSize: "14px" }}>
      <Link to="/">Home</Link>

      {paths.map((name, index) => {
        currentPath += `/${name}`;
        const isLast = index === paths.length - 1;

        return (
          <span key={index}>
            {" / "}
            {isLast ? (
              <span>{name}</span>
            ) : (
              <Link to={currentPath}>{name}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
