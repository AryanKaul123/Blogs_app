import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { Table, Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashComments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/comment/getcomments`, {
                    credentials: 'include'
                });
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentUser.IsAdmin) {
            fetchComments();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(`http://localhost:4000/api/comment/getcomments?startIndex=${startIndex}`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`http://localhost:4000/api/comment/deleteComment/${commentIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.IsAdmin && comments.length>0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Data created</Table.HeadCell>
                            <Table.HeadCell>Comment Content</Table.HeadCell>
                            <Table.HeadCell>NumberofLikes</Table.HeadCell>
                            <Table.HeadCell>PostId</Table.HeadCell>
                            <Table.HeadCell>UserId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body className='divide-y' key={comment._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(comment.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span className='font-md text-red-500 hover:underline cursor-pointer'
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(comment._id);
                                            }}
                                        >Delete</span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    
                    {showMore && (
                        <Button className='w-full text-teal-800 self-center text-sm' onClick={handleShowMore}>
                            Show more
                        </Button>
                    )}
            </>
            ) : (
                <p>There are no Comments yet</p>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this Comment?</h3>
                        <div className='flex justify-center gap-x-7'>
                            <Button color='failure' onClick={handleDeleteComment}>Yes, I'm Sure</Button>
                            <Button color='grey' onClick={() => setShowModal(false)}>No</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashComments;
