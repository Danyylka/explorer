import clsx from "clsx";
import { Status } from "../../app/[network]/[type]/[query]/[[...viewPath]]/(components)/status";
import { Value } from "../../schemas/value";

interface Props {
  attributes: Record<string, Value>;
  type: "card" | "sidebar";
}

export function KeyValueList({ attributes, type: kvType }: Props) {
  return (
    <dl
      className={clsx(
        "grid",
        kvType === "card" &&
          "sm:grid-cols-[minmax(200px,auto)_1fr] grid-cols-[minmax(128px,auto)_1fr] gap-y-2",
        kvType === "sidebar" && "grid-cols-[auto_1fr] gap-y-4 gap-x-6"
      )}
    >
      {Object.entries(attributes).map(([key, value]) => {
        const { type, payload } = value;
        if (!payload) return null;
        return (
          <>
            <dt className="font-bold">{key}</dt>
            {type === "status" ? (
              <dd>
                <Status status={payload} />
              </dd>
            ) : null}
            {type === "list" ? (
              <dd className="truncate">
                <ol>
                  {payload.map((value) => (
                    <li className="truncate">{value}</li>
                  ))}
                </ol>
              </dd>
            ) : null}
            {type === "standard" ? (
              <dd className="truncate">{payload}</dd>
            ) : null}
          </>
        );
      })}
    </dl>
  );
}