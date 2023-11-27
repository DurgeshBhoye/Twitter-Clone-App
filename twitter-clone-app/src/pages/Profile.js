import './Profile.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import Tweet from '../components/Tweet';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

// Profile page or User's details page
const Profile = () => {

    const [profileData, setProfileData] = useState({});
    const [usersTweet, setUsersTweet] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState({ preview: '', data: '' });
    const [date, setDate] = useState(new Date());

    const { userId } = useParams();           // get userId from URL
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const user = useSelector(state => state.userReducer.user)      // get user's details stored in redux store

    // To send with the request as a JWT token (send JWT token String as authenticated requests)
    const CONFIG_OBJECT = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }


    // get user information
    const fetchProfileData = async () => {
        try {
            if (userId) {
                const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
                const userTweetsURL = await axios.get(`${API_BASE_URL}/api/user/${userId}/tweets`);
                setProfileData(response.data.user);
                setUsersTweet(userTweetsURL.data.tweets);
                setLoading(false);
            }
            else {
                return
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [userId]);

    // console.log(profileData);
    // console.log(usersTweet);

    // function to follow / unfollow user
    const handleFollow = async (e) => {
        e.preventDefault();

        try {
            const follow = await axios.put(`${API_BASE_URL}/api/user/${userId}/follow`, { userId: userId }, CONFIG_OBJECT);
            // console.log("follow : ", follow.data.success);
            toast.info(`${follow.data.success}`, {
                autoClose: 3000,
            });
            fetchProfileData();

        } catch (err) {
            console.log("error", err);
        }
    };

    // function to edit profile details of logged in user
    const updateProfile = async () => {

        // validating fields present or not
        if (name === '') {
            toast.warn('Name required!', {
                position: "top-center",
                autoClose: 3000,
            });
        }
        else if (location === '') {
            toast.warn('Location required!', {
                position: "top-center",
                autoClose: 3000,
            });
        }
        else if (date === '') {
            toast.warn('Date required!', {
                position: "top-center",
                autoClose: 3000,
            });
        }

        // if all fields present update profile
        else {
            // setLoading(true);
            const request = {
                name: name,
                location: location,
                date_of_birth: date,
                userId: userId,
            }

            // api call to update details
            const addResponse = await axios.put(`${API_BASE_URL}/api/user/${userId}/`, request, CONFIG_OBJECT)

            if (addResponse.status === 200) {
                // console.log(addResponse.data.user.name);
                localStorage.setItem('user', JSON.stringify(addResponse.data.user));  // to localStorage
                dispatch({ type: 'LOGIN_SUCCESS', payload: addResponse.data.user, })
                // getAllTweets();
                // console.log(profileData);
                fetchProfileData();
                setName("");
                setLocation("");
                setDate("");
                toast.success('Profile updated!', {
                    autoClose: 3000,
                });
            }
            else {
                toast.error('Error updating profile!', {
                    autoClose: 3000,
                });
            }
        }
    }

    // function to edit profile picture
    const handleFileSelect = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0]
        }
        setImage(img);
    }

    // function for uploading images
    const handleImgUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', image.data);

        const response = axios.post(`${API_BASE_URL}/uploadProfilePic`, formData) // ,CONFIG_OBJECT can be added next
        return response;
    }


    // upload or update profile picture
    const uploadProfilePic = async () => {

        if (image.preview === '') {
            toast.warn('Image required!', {
                position: "top-center",
                autoClose: 3000,
            });
        }
        else {
            try {
                const imgRes = await handleImgUpload();
                const request = {
                    profilePic: `${API_BASE_URL}/files/${imgRes.data.fileName}`
                }
                const addImage = await axios.put(`${API_BASE_URL}/api/user/${userId}/profilepic`, request, CONFIG_OBJECT);

                if (addImage.status === 200) {

                    localStorage.setItem('user', JSON.stringify(addImage.data.user));  // to localStorage
                    dispatch({ type: 'LOGIN_SUCCESS', payload: addImage.data.user, })

                    fetchProfileData();
                    setImage({ preview: '', data: '' });
                    toast.success('Image updated!', {
                        autoClose: 3000,
                    });
                }
                else {
                    // setLoading(false);
                    toast.error('Error updating image!', {
                        autoClose: 3000,
                    });
                }

            }
            catch (err) {
                console.log("error", err);
            }
        }
    }


    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    // console.log("Profile data : ", profileData);


    // function for logout and navigate to login page (for small screens devices)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });
        toast('Logged out successful!', {
            autoClose: 5000,
        });
        navigate('/login');             // navigate to login page when logged out successful
        window.location.reload();
    }



    // ==========================================================================

    return (
        <div className='col-12 col-md-6'>

            {/* Small screen sidebar modal/offcanvas button */}
            <button className="bg-white p-3 d-md-none d-sm-block border border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasProfile" aria-controls="offcanvasProfile">
                <img src='https://freelogopng.com/images/all_img/1657043345twitter-logo-png.png' alt='logo' width='30px' />
            </button>

            {/* Profile Details */}
            <div className="p-3 bg-light border border-1 border-dark">
                <h4 className='fw-bold'>Profile</h4>
                <div className='d-flex flex-column'>
                    <div className="profile-top-container">
                        <div className="header-photo">
                            <img src="https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/64af3aac29866b3f86f1c648_Products%20%26%20Features%20-%202-p-1600.png" alt="Header" />
                        </div>
                        <div className="profile">
                            <div className="prof-pic-and-buttons-row mb-5">
                                <div className="prof-pic border border-3 border-light">
                                    <img src={profileData.profilePic} alt={profileData.name} />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className='fw-bold'>{profileData.name}</h5>
                                    <p className='text-muted'>@{profileData.username}</p>
                                </div>


                                {/* Follow/Unfollow button (if not logged in user) or Update profile buttons (if logged in user)*/}
                                <div>
                                    {!isLoading && profileData && (
                                        <>
                                            {user._id !== userId ?

                                                <button className='btn btn-dark rounded-5' onClick={handleFollow}>
                                                    {profileData.followers.includes(user._id) ? (
                                                        <span className='fw-bold'>Following</span>
                                                    ) : (
                                                        <span className='fw-bold'>Follow</span>
                                                    )}
                                                </button>
                                                :
                                                <div>
                                                    {/* update profile picture button */}
                                                    <button type="button" className="btn btn-outline-primary rounded-5 px-3" data-bs-toggle="modal" data-bs-target="#profileupdate">
                                                        Upload Profile Photo
                                                    </button>

                                                    {/* update profile picture modal */}
                                                    <div className="modal fade" id="profileupdate" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Upload Profile Pic</h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className="alert alert-info" role="alert" style={{ fontSize: "14px" }}>
                                                                        Note: Image should be square in shape and size less that 10mb.
                                                                    </div>
                                                                    <div onChange={handleFileSelect}>
                                                                        <div className="w-50">
                                                                            <input name='file' type="file" id="drop_zone" className="form-control" accept=".jpg,.png,.gif, text/*" />
                                                                        </div>


                                                                        {image.preview && (
                                                                            <img src={image.preview} width='100%' alt='' height='100%' className='img-fluid border border-2 border-dark rounded shadow-sm mt-3' />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary rounded-5 px-3" data-bs-dismiss="modal">Close</button>
                                                                    <button onClick={uploadProfilePic} type="button" className="btn btn-primary rounded-5 px-3">Update</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>





                                                    {/* Edit user's details button */}
                                                    <button type="button" className="btn btn-outline-dark ms-2 rounded-5 px-3" data-bs-toggle="modal" data-bs-target="#edituser">
                                                        Edit
                                                    </button>

                                                    {/* Edit user's details Modal */}
                                                    <div className="modal fade" id="edituser" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                        <div className="modal-dialog">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Profile</h1>
                                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Name</label>
                                                                        <input onChange={(e) => setName(e.target.value)} type="text" className="form-control" placeholder="name" />
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Location</label>
                                                                        <input onChange={(e) => setLocation(e.target.value)} type="text" className="form-control" placeholder="location" />
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label className="form-label">Date of birth : mm/dd/yyyy</label>
                                                                        {/* <input onChange={(e) => setDOB(e.target.value)} type="text" className="form-control" placeholder="MM/DD/YYYY" /> */}
                                                                        <div className="form-control" >
                                                                            <DatePicker id='datepicker' selected={date} onChange={(date) => setDate(date)} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary rounded-5 px-3" data-bs-dismiss="modal">Close</button>
                                                                    <button onClick={updateProfile} type="button" className="btn btn-primary rounded-5 px-3">Update</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="text-muted d-flex w-75 flex-wrap gap-3">
                                <div>
                                    <span><i className="fa-solid fa-calendar-days"></i> </span>
                                    <span> DOB : {moment(profileData.date_of_birth).format("DD MMMM YYYY")}</span>
                                </div>
                                <div>
                                    <span><i className="fa-solid fa-location-dot"></i> </span>
                                    <span> Location : {profileData.location}</span>
                                </div>
                                <div>
                                    <span><i className="fa-solid fa-calendar"></i> </span>
                                    <span>Joined {moment(profileData.createdAt).format("DD MMMM YYYY")}</span>
                                </div>

                            </div>
                            <div className="d-flex w-50 mt-4">
                                <div>
                                    <span className="fw-semibold me-3">{profileData.following.length} Following</span>
                                </div>
                                <div>
                                    <span className="fw-semibold">{profileData.followers.length} Followers</span>
                                </div>
                            </div>
                        </div>
                        <h5 className='text-center fw-bold'>Posts</h5>
                        <hr className='border border-2 border-dark' />

                        {/* User's tweets list */}
                        <div className="list-group list-group-flush border-bottom">
                            {usersTweet.map((tweet) => (
                                <div key={tweet._id}>
                                    <Tweet tweets={tweet} setData={fetchProfileData} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Small screen sidebar modal or offcanvas */}
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasProfile" aria-labelledby="offcanvasProfileLabel" style={{ height: "100vh" }}>
                <div className="offcanvas-header">
                    <Link to="/" className="d-flex align-items-center mb-md-0 me-md-auto text-decoration-none gap-3" id="offcanvasProfileLabel">
                        <img src='https://freelogopng.com/images/all_img/1657043345twitter-logo-png.png' alt='logo' width='30px' />
                        <span className="fs-4">Twitter</span>
                    </Link>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <ul className="nav nav-pills flex-column mb-auto">
                        <li onClick={() => navigate(`/`)} className="nav-item">
                            <Link href="#" className="nav-link active d-flex gap-3 align-items-center" aria-current="page">
                                <i className="fa-solid fa-house"></i>
                                <span> Home</span>
                            </Link>
                        </li>
                        <li onClick={() => navigate(`/profile/${user._id}`)}>
                            <Link className="nav-link link-body-emphasis d-flex gap-3 align-items-center">
                                <i className="fa-solid fa-user"></i>
                                <span> Profile</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="nav-link link-body-emphasis d-flex gap-3 align-items-center">
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span onClick={logout}> Logout</span>
                            </Link>
                        </li>
                    </ul>

                    <hr />
                    {user._id ?
                        <div>
                            <Link className="d-flex align-items-center link-body-emphasis text-decoration-none gap-2">
                                <img src={user.profilePic} alt="" width="36" height="36" className="rounded-circle me-2" />
                                <div className='d-flex flex-column'>
                                    <strong>{user.name}</strong>
                                    <h6>@{user.username}</h6>
                                </div>
                            </Link>
                        </div>
                        : ''}

                </div>
            </div>

        </div>
    )
}

export default Profile;