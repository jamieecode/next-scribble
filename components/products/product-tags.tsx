"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/server";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (!tag) {
      router.push("/");
    }

    if (tag) {
      router.push(`?tag=${tag}`);
    }
  };

  const colors = ["blue", "green", "purple"];

  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer bg-primary hover:bg-primary/75",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>

      {colors.map((color) => (
        <Badge
          key={color}
          onClick={() => setFilter(color)}
          className={cn(
            `cursor-pointer hover:bg-${color}-600 hover:opacity-100`,
            {
              [`bg-${color}-500`]: true,
              "opacity-100": tag === color && tag,
              "opacity-50": !(tag === color && tag),
            }
          )}
        >
          {color}
        </Badge>
      ))}
    </div>
  );
}
