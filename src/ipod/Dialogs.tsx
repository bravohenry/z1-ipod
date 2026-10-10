/**
 * [INPUT]: Base UI Dialog/Button 与 iPod 宿主会话。
 * [OUTPUT]: IpodDialogs，添加、搜索和来源窗口。
 * [POS]: 屏幕之外的编辑边界；Base UI 拥有焦点锁、Escape 与回程。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
"use client";
import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import type { IpodController } from "./use-controller";
export function IpodDialogs({ c }: { c: IpodController }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  return (
    <Dialog.Root
      open={Boolean(c.dialog)}
      onOpenChange={(open) => {
        if (!open) {
          c.setDialog(null);
          setValue("");
          setError("");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[11000] bg-black/20" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 z-[11001] w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 text-[#171717] shadow-lg"
          data-cursor-native=""
        >
          <Dialog.Title className="mb-3 text-xl">
            {c.dialog === "add"
              ? "Add Songs"
              : c.dialog === "search"
                ? "Search Songs"
                : "About this iPod"}
          </Dialog.Title>
          {c.dialog === "about" ? (
            <>
              <p className="mb-3 text-base font-medium tracking-tight">
                z1han.com 改编自 ryOS
              </p>
              <Dialog.Description className="text-sm">
                iPod interface by Ryo Lu / ryOS (commit d989f4d). Adapted for
                Z1 by Zihan Huang. Licensed under AGPL-3.0-or-later.
              </Dialog.Description>
              <p className="my-3 text-sm">
                Public source for this adaptation:{" "}
                <a
                  href="https://github.com/bravohenry/z1-ipod"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  bravohenry/z1-ipod
                </a>{" "}
                (AGPL-3.0). Apple Music requires separate developer credentials.
                YouTube playback follows each video’s embed permissions.
              </p>
              <a
                href="https://github.com/ryokun6/ryos"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Original ryOS
              </a>
              <a
                href="https://github.com/bravohenry/z1-ipod"
                target="_blank"
                rel="noreferrer"
                className="ml-4 underline"
              >
                z1-ipod (AGPL-3.0)
              </a>
              <a
                href="/ipod/ryos/LICENSE.txt"
                target="_blank"
                rel="noreferrer"
                className="ml-4 underline"
              >
                License text
              </a>
            </>
          ) : (
            <>
              <Dialog.Description className="mb-3 text-sm">
                {c.dialog === "add"
                  ? "Paste YouTube links separated by commas."
                  : "Find songs in your iPod library."}
              </Dialog.Description>
              <label className="block text-sm" htmlFor="ipod-query">
                {c.dialog === "add" ? "YouTube links" : "Song or artist"}
              </label>
              <input
                id="ipod-query"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError("");
                }}
                className="my-2 w-full rounded border border-black/20 p-2 text-base"
              />
              {error && (
                <p role="alert" className="mb-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {c.dialog === "add" ? (
                <Button
                  onClick={() => {
                    if (c.library.add(value)) {
                      c.setDialog(null);
                      setValue("");
                      c.showStatus("Songs added");
                    } else setError("Enter a valid YouTube link.");
                  }}
                >
                  Add Songs
                </Button>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {c.library.tracks
                    .map((track, index) => ({ track, index }))
                    .filter(({ track }) =>
                      `${track.title} ${track.artist ?? ""}`
                        .toLowerCase()
                        .includes(value.toLowerCase()),
                    )
                    .map(({ track, index }) => (
                      <Button
                        key={track.id}
                        className="mb-1 h-auto w-full justify-start whitespace-normal text-left"
                        onClick={() => {
                          c.playTrack(index);
                          c.setDialog(null);
                        }}
                      >
                        {track.title}
                      </Button>
                    ))}
                </div>
              )}
            </>
          )}
          <Dialog.Close render={<Button className="mt-4" />}>
            Close
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
