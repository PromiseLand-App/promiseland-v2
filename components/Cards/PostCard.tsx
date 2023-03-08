import React, { useEffect, useState } from "react";
import Image from "next/image";
import SubscribeBtn from "../Buttons/SubscribeBtn";
import { IPostCard } from "../../types";
import { parseURL, timeSince } from "@/lib/functions";
import Loader from "../Loader";
import Avatar from "@/components/Avatar";
import { AiOutlineFileProtect } from "react-icons/ai";
import { useRouter } from "next/router";
import { formatDate } from "@/lib/functions";

const PostCard = ({
  essenceID,
  tokenURI,
  createdBy,
  isCollectedByMe,
  isIndexed,
}: IPostCard) => {
  const router = useRouter();
  const { handle, profileID, metadata, owner } = createdBy;

  const [name, setName] = useState("");
  const [data, setData] = useState<any>({
    image: "",
    image_data: "",
    content: "",
    issue_date: "",
    attributes: [],
    name: "",
    tags: [],
    description: "",
  });
  const [loadFromIPFSFailed, setLoadFromIPFSFailed] = useState(false);

  useEffect(() => {
    if (!tokenURI) return;
    (async () => {
      setData({
        image: "",
        image_data: "",
        content: "",
        issue_date: "",
        attributes: [],
      });
      try {
        const res = await fetch(parseURL(tokenURI));
        if (res.status === 200) {
          const data = await res.json();
          setData(data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [tokenURI]);

  useEffect(() => {
    if (!metadata) return;
    (async () => {
      setName("");
      try {
        const res = await fetch(parseURL(metadata));
        if (res.status === 200) {
          const data = await res.json();
          setName(data?.name);
        } else {
          setLoadFromIPFSFailed(true);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [metadata]);

  const viewDetail = () => {
    router.push(
      `/${handle}/${encodeURIComponent(
        tokenURI,
      )}?essenceID=${essenceID}&profileID=${profileID}&isCollectedByMe=${isCollectedByMe}`,
    );
  };

  const goToProfile = () => {
    if (owner?.address) {
      router.push(`/u/${owner.address}`);
    }
  };

  return (
    <>
      {!loadFromIPFSFailed &&
        data?.content &&
        data.tags.includes("lit-v1.2") && (
          <div className="mt-8">
            <div className="flex justify-between gap-x-4 rounded-xl border  border-gray-300 p-4 hover:bg-neutral-50">
              <div className="flex flex-col">
                <div
                  className="flex cursor-pointer gap-x-4"
                  onClick={goToProfile}
                >
                  <div>
                    <Avatar value={handle} size={50} />
                  </div>
                  <div className="flex items-center gap-x-1">
                    <div className="flex flex-col">
                      <div className="leading-6">{name}</div>
                      <div className="text-xs leading-6 text-gray-500">
                        @{handle}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs">
                  {formatDate(new Date(data.issue_date))}
                </div>
                <div className="mt-4 cursor-pointer" onClick={viewDetail}>
                  <div className="text-xl font-bold">{data.name}</div>
                  <div className="mt-4 text-base">{data.description}</div>
                </div>
                <div className="mt-16 flex w-full grow  items-end">
                  {isIndexed ? (
                    <SubscribeBtn
                      isSubscribedByMe={owner.primaryProfile.isSubscribedByMe}
                      profileID={profileID}
                    />
                  ) : (
                    <Loader />
                  )}
                </div>
              </div>
              <div
                onClick={viewDetail}
                className="flex shrink-0  cursor-pointer flex-col justify-between"
              >
                <Image
                  className="rounded-xl object-cover"
                  src={data?.image}
                  alt="nft"
                  width={280}
                  height={200}
                  placeholder="blur"
                  blurDataURL="/assets/essence-placeholder.svg"
                />

                <div className="flex items-center gap-x-1">
                  <AiOutlineFileProtect
                    size={18}
                    className="m-0 text-slate-500"
                  />
                  <span className="text-right text-sm text-slate-500">
                    This post is protected by Lit Protocol
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default PostCard;
