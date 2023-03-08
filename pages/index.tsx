import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import WebVitals from "@/components/home/web-vitals";
import ComponentGrid from "@/components/home/component-grid";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { AuthContext } from "../context/auth";
import Navbar from "../components/Navbar";
import Panel from "../components/Panel";
import PostCard from "../components/Cards/PostCard";
import { IPostCard } from "../types";
import { useLazyQuery } from "@apollo/client";
import { PRIMARY_PROFILE_ESSENCES } from "../graphql";
import Loading from "@/components/Loading";

export default function Home() {
  const { address, accessToken } = useContext(AuthContext);
  const [getEssencesByFilter] = useLazyQuery(PRIMARY_PROFILE_ESSENCES);
  const [featuredPosts, setFeaturedPosts] = useState<IPostCard[]>([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEssences = async (publisherAddress: string) => {
      const { data } = await getEssencesByFilter({
        variables: {
          address: publisherAddress,
          // chainID: 5,
          myAddress:
            address && accessToken
              ? address
              : "0x0000000000000000000000000000000000000000",
        },
      });

      setFeaturedPosts(
        data?.address.wallet?.primaryProfile?.essences?.edges.map(
          (item: any) => item.node,
        ) || [],
      );

      setIsLoading(false);
    };

    getEssences("0x2a871F46afCc105A91706602561F05BDe9D75BCb");

    return () => {
      setFeaturedPosts([]);
    };
  }, [getEssencesByFilter, address, accessToken]);

  return (
    <Layout>
      {loading ? (
        <Loading />
      ) : (
        <div className="posts">
          <div>
            {featuredPosts.length > 0 &&
              featuredPosts.map((post) => (
                <PostCard
                  key={`${post.createdBy.profileID}-${post.essenceID}`}
                  {...post}
                  isIndexed={true}
                />
              ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
