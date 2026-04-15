import { Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetApiTags } from "@/external/api";
import { getTagColor } from "./Tag";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchField() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const anchor = useComboboxAnchor();
  const { data, isLoading, error } = useGetApiTags();
  const tags = data?.data.map((item) => item.name) ?? [];
  const selectedTags =
    searchParams.get("tags")?.split(",").filter(Boolean) ?? [];

  const handleSearch = (values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) {
      params.set("tags", values.join(","));
    } else {
      params.delete("tags");
    }
    router.push(`/books?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return (
    <div className="flex w-full item-center flex-1 min-w-0">
      <Combobox
        multiple
        autoHighlight
        items={tags}
        value={selectedTags}
        onValueChange={(value) => handleSearch(value as string[])}
      >
        <ComboboxChips
          ref={anchor}
          className="flex-nowrap w-2/3 min-w-100 bg-card"
        >
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <div
            className="overflow-x-auto flex-1 flex items-center [&::-webkit-scrollbar]:hidden"
            onWheel={(e) => {
              e.currentTarget.scrollLeft += e.deltaY;
            }}
          >
            <ComboboxValue>
              {(values) => (
                <div className="flex gap-1">
                  <Fragment>
                    {(values as string[]).map((value) => (
                      <ComboboxChip
                        key={value}
                        className={cn(getTagColor(value))}
                      >
                        {value}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput
                      className="!min-w-0 !flex-none"
                      size={1}
                    />
                  </Fragment>
                </div>
              )}
            </ComboboxValue>
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0"
              onClick={() => handleSearch([])}
            >
              <X />
            </Button>
          )}
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty></ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
