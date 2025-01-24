import React, {useState, useEffect} from 'react';
import axios from 'axios';

const SubmissionsList = () => {
    const [submissions, setSubmissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [orderBy, setOrderBy] = useState('asc');
    const [emailDomain, setEmailDomain] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState({name: '', email: '', message: '', id: ''});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const itemsPerPage = 10;
    const API_URL = "http://localhost:5001/submissions";

    // Fetch submissions for the current page
    const fetchSubmissions = async (page) => {
        setLoading(true);
        try{
            setError('');
            const response = await axios.get(API_URL, {
                params: {
                    page, 
                    limit: itemsPerPage,
                    search: searchQuery,
                    sortBy: sortBy,
                    order: orderBy,
                    emailDomain,
                },
            });
            setSubmissions(response.data.submissions);
            setTotalPages(response.data.totalPages);
            console.log(response.data);
        }
        catch(err) {
            setError('Failed to fetch submissions, Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
 
    // Fetch submissions when the component loads or page changes
    useEffect(() => {
        fetchSubmissions(currentPage);
    }, [currentPage, searchQuery, sortBy, orderBy, emailDomain]);

    const handleEdit = (submission) => {
        setEditMode(true);
        setEditFormData({
            name: submission.name,
            email: submission.email,
            message: submission.message,
            id: submission._id,
        });
    };

    const handleUpdate = async () => {
        if (!editFormData.name || !editFormData.email || !editFormData.message) {
            alert('All fields are required!');
            return;
        }

        try {
            setLoading(true);
            await axios.put(`${API_URL}/${editFormData.id}`, {
                name: editFormData.name,
                email: editFormData.email,
                message: editFormData.message,
            });
            setEditMode(false);
            fetchSubmissions(); // Refresh the list
        } catch (err) {
            setError('Failed to update submission.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleNextPage = () => {
        if(currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if(currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div>
            <div>
                <input
                    type = "text"
                    placeholder="Search with name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div>
                <label>Sort By:</label>
                <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </select>
                <select onChange={(e) => setOrderBy(e.target.value)} value={orderBy}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            <div>
                <label>Filter by Email Domain:</label>
                <select onChange={(e) => setEmailDomain(e.target.value)} value={emailDomain}>
                    <option value="">--Select--</option>
                    <option value="gmail.com">Gmail</option>
                    <option value="yahoo.com">Yahoo</option>
                    <option value="outlook.com">Outlook</option>
                    <option value="hotmail.com">Hotmail</option>
                </select>
            </div>

            {/* Edit Form */}
            {editMode && (
                <div style={{marginBottom: '20px'}}>
                    <h3>Edit Submission</h3>
                    <div>
                        <label>Name:</label>
                        <input 
                            type='text'
                            name='name'
                            placeholder='Name'
                            value={editFormData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={editFormData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Message:</label>
                        <textarea
                            name="message"
                            placeholder="Message"
                            value={editFormData.message}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <button onClick={handleUpdate}>Update</button>
                        <button onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ): (
            <div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <table border="1" style={{ width: '100%', marginBottom: '20px' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? (
                            submissions.map((submission) => (
                                <tr key={submission._id}>
                                    <td>{submission.name}</td>
                                    <td>{submission.email}</td>
                                    <td>{submission.message}</td>
                                    <td>
                                        <button onClick={() => handleEdit(submission)}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>No Submissions Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div>
                    <button onClick={handlePreviousPage} disabled = {currentPage === 1}>Previous</button>
                    <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled = {currentPage === totalPages}>Next</button>
                </div>
            </div>
            )}
        </div>
    );
};

export default SubmissionsList;