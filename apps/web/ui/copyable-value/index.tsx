"use client";
import * as React from "react";
// components
import { Copy } from "~/ui/icons";
import { Tooltip } from "~/ui/tooltip";
import { Button } from "~/ui/button";

// utils
import { copyValueToClipboard, truncateHash } from "~/lib/shared-utils";
import { useToast } from "~/ui/shadcn/components/ui/use-toast";
import { cn } from "~/ui/shadcn/utils";

// types
import type { TooltipPosition } from "~/ui/tooltip";
interface Props {
  value: string;
  hideCopyIcon?: boolean;
  className?: string;
  tooltipPosition?: TooltipPosition;
}

export function CopyableValue({
  value,
  className,
  hideCopyIcon = false,
  tooltipPosition,
}: Props) {
  const { toast } = useToast();
  return (
    <span
      className={cn(
        "inline-flex gap-2 max-w-full w-full py-1 items-center",
        className,
      )}
    >
      {!hideCopyIcon ? (
        <>
          <p
            className="text-ellipsis whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full"
            tabIndex={-1}
          >
            {value}
          </p>
          <Tooltip label="Copy value to clipboard" side={tooltipPosition}>
            <Button
              isSquared
              className="bg-transparent"
              onClick={async () => {
                const copied = await copyValueToClipboard(value);

                if (copied) {
                  toast({
                    title: "Copied",
                    description: `"${truncateHash(value)}" copied to clipboard`,
                  });
                }
              }}
            >
              <span className="sr-only">Copy value to clipboard</span>
              <Copy aria-hidden="true" className="text-muted" />
            </Button>
          </Tooltip>
        </>
      ) : (
        <Tooltip label="Copy value to clipboard" side={tooltipPosition}>
          <Button
            className="max-w-full bg-transparent font-normal"
            onClick={async () => {
              const copied = await copyValueToClipboard(value);

              if (copied) {
                toast({
                  title: "Copied",
                  description: `"${truncateHash(value)}" copied to clipboard`,
                });
              }
            }}
          >
            <span
              className="text-ellipsis whitespace-nowrap overflow-x-hidden flex-shrink flex-grow-0 max-w-full"
              tabIndex={-1}
            >
              {value}
            </span>

            <span className="sr-only">Copy value to clipboard</span>
          </Button>
        </Tooltip>
      )}
    </span>
  );
}