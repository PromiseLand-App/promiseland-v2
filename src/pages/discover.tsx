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
import Layout from "@/components/layout";

const DiscoverPage: NextPage = () => {
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
      <div className="container">
        <Navbar />
        <div className="wrapper">
          <div className="wrapper-content">
            <h1 className="text-2xl font-bold">Recommendations</h1>
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
          </div>
          <div className="wrapper-details">
            <Panel />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiscoverPage;
