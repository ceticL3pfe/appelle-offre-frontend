export const registerUser = async (userData, setError) => {
    try {
        const response = await fetch('http://localhost:5000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.status === 409) {
            console.log('errorrrr')
            setError('email already exists');
        } else {
            setError('Unknown error');
        }
    } catch (err) {
        console.log('network error', err.message);
        setError('network error');
    }
};