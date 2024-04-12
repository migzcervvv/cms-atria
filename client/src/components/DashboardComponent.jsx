import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiArrowNarrowUp,
  HiOutlineUserGroup,
  HiDocumentText,
} from "react-icons/hi";
import { Button, Table, TableHead } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getposts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
    }
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <div className="flex flex-row gap-x-5">
              <div className=" flex justify-between">
                <div className="">
                  <h3 className="text-gray-500 text-md uppercase">
                    Total Posts
                  </h3>
                  <p className="text-2xl">{totalPosts}</p>
                </div>{" "}
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="text-gray-500">Last Month</div>
                <span className="text-green-600 flex items-center">
                  <HiArrowNarrowUp />
                  {lastMonthPosts}
                </span>
              </div>
            </div>
            <Button outline gradientDuoTone="purpleToBlue">
              <Link to={"/dashboard?tab=posts"} className="flex items-center">
                See all
              </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="user"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">
                      <p>{post.title}</p>
                    </Table.Cell>
                    <Table.Cell className="w-5">
                      <p>{post.category}</p>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
