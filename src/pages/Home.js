import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import instance from "../axiosConfig";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { BiSearch } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import PostBox from "../components/PostBox";

const Home = () => {
  const navigate = useNavigate();
  const area_ref = useRef();
  const category_ref = useRef();
  const search_ref = useRef();
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [areaSelected, setAreaSelected] = useState("ALL");
  const [categorySelected, setCategorySelected] = useState("ALL");
  const [search, setSearch] = useState(null);

  const getPosts = async (pageParam = 0) => {
    if (search) {
      const res = await instance.get(
        `/api/posts/search?keyword=${search}&page=${pageParam}&size=6`
      );
      const data = res.data.list.content;
      const last = res.data.list.last;
      return { data, nextPage: pageParam + 1, last };
    } else {
      const res = await instance.get(
        `/api/posts?category=${categorySelected}&area=${areaSelected}&page=${pageParam}&size=6`
      );
      const data = res.data.list.content;
      const last = res.data.list.last;
      return { data, nextPage: pageParam + 1, last };
    }
  };

  const { data, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    ["postList"],
    ({ pageParam = 0 }) => getPosts(pageParam),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.last ? lastPage.nextPage : undefined,
    }
  );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    refetch();
  }, [search, data]);

  useEffect(() => {
    refetch();
    setSearch(null);
  }, [areaSelected, categorySelected]);

  const handleArea = () => {
    setAreaSelected(area_ref.current.value);
  };

  const handleCategory = () => {
    setCategorySelected(category_ref.current.value);
  };

  const onClicksearch = () => {
    setSearch(search_ref.current.value);
    search_ref.current.value = "";
  };
  return (
    <>
      <MainDiv>
        <HeaderComponent>
          <FilterBox>
            <Areabar>
              <select onChange={handleArea} ref={area_ref}>
                <option value="ALL">????????? ??????</option>
                <option value="NAMGU">??????</option>
                <option value="DALSEOGU">?????????</option>
                <option value="DALSEONGGUN">?????????</option>
                <option value="DONGGU">??????</option>
                <option value="BUKGU">??????</option>
                <option value="SEOGU">??????</option>
                <option value="SUSEONGGU">?????????</option>
                <option value="JUNGGU">??????</option>
              </select>
            </Areabar>
            <Navbar>
              <select onChange={handleCategory} ref={category_ref}>
                <option value="ALL">?????? ????????????</option>
                <option value="DIGITAL">???????????????</option>
                <option value="APPLIANCES">????????????</option>
                <option value="HOUSEHOLD">??????/????????????</option>
                <option value="KID">??????</option>
                <option value="GROCERIES">??????/????????????</option>
                <option value="SPORT">?????????/??????</option>
                <option value="CLOTHES">??????</option>
                <option value="INTEREST">??????/??????</option>
                <option value="BEAUTY">??????/??????</option>
                <option value="PET">??????????????????</option>
                <option value="BOOK">??????/??????/??????</option>
                <option value="PLANT">??????</option>
                <option value="ETC">??????</option>
              </select>
            </Navbar>
          </FilterBox>
          <InputWrap>
            <input ref={search_ref}></input>
            <BiSearch
              onClick={() => {
                onClicksearch();
              }}
            />
          </InputWrap>
        </HeaderComponent>
        {data &&
          data.pages.map((page, idx) => {
            return (
              <React.Fragment key={idx}>
                {page.data.map((post) => (
                  <PostContainer
                    key={post.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate(`/post/${post.id}`);
                    }}
                  >
                    <PostBox data={post} />
                  </PostContainer>
                ))}
              </React.Fragment>
            );
          })}
        {isFetchingNextPage ? <Spinner /> : <div ref={ref} />}
        <PostBtn>
          <Link to="/post">
            <FiPlusCircle />
          </Link>
        </PostBtn>
        <Footer />
      </MainDiv>
    </>
  );
};

export default Home;

const MainDiv = styled.div`
  position: relative;
  width: 40rem;
  background: #fffbf7;
  height: calc(100vh - 14rem);
  margin: 7rem auto;
  justify-content: center;
  overflow-y: auto;
`;

const HeaderComponent = styled.header`
  position: fixed;
  width: 35rem;
  height: 7rem;
  top: 0;
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 0 2.5rem;
  background: #ffecd7;
  justify-content: space-between;
  img {
    width: 3rem;
    height: 3rem;
  }
  select {
    cursor: pointer;
    border-radius: 5px;
    background: #fffbf7;
    width: 7rem;
    border: none;
    padding: 1rem 0.2rem;
    &:hover {
      background: #f6f6f6;
    }
  }
  input {
    border: none;
    background: #fffbf7;
    border-radius: 5px;
    padding: 1rem 0.2rem;
  }
`;

const FilterBox = styled.div`
  display: flex;
  width: 15rem;
  justify-content: space-between;
`;

const Areabar = styled.div`
  display: flex;
  gap: 1rem;
`;

const Navbar = styled.div`
  display: flex;
  gap: 1rem;
  button {
    background: #fffbf7;
    border: none;
    padding: 1rem;
    border-radius: 5px;
    &:hover {
      background: #f6f6f6;
    }
  }
`;

const InputWrap = styled.div`
  align-items: center;
  display: flex;
  svg {
    cursor: pointer;
    font-size: 2rem;
    border-radius: 5px;
    padding: 0.3rem;
    margin-left: 0.3rem;
    color: #e78111;
  }
`;

const PostContainer = styled.div`
  margin: 0 auto;
  width: calc(100% - 6rem);
  height: 12rem;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
`;

const PostBtn = styled.div`
  cursor: pointer;
   position: fixed;
  bottom: 20%;
  right: 30%;
  margin-right: 10rem;
  border-radius: 5rem;
  svg {
    width: 6rem;
    height: 6rem;
    border-radius: 5rem;
    font-size: 6rem;
    color: #e78111;
    background: #fffbf7;
  }
`;
