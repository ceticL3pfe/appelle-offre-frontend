import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { selectToken } from '../../features/users/userSlice';
// import { userId } from '../../components/Chatbar/ChatBar';
// const userId = sessionStorage.getItem('userId')
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        prepareHeaders: (headers, { getState }) => {

            const token = selectToken(getState())// Get the token from the Redux store

            if (token) {
                headers.set('token', `${token}`);
            }
            return headers;

        }
    }),
    tagTypes: 'User',
    endpoints: (builder) => ({





        registerUser: builder.mutation({
            query: (data) => ({
                url: 'admin/register',
                method: 'POST',
                body: data
            }),

        }),
        logInUser: builder.mutation({
            query: (data) => ({
                url: 'user/login',
                method: 'POST',
                body: data
            }),

        }),

        // updateUser: builder.mutation({
        //     query: (data) => ({
        //         url: `user/update/${data.userId}`,
        //         method: 'PUT',
        //         body: { email: data?.email, username: data?.username, password: data?.password, image: data?.image }
        //     }),

        // }),

        signOutUser: builder.mutation({
            query: () => ({
                url: 'user/signOut',
                method: 'POST',
                body: ''
            }),

        }),

        getProtection: builder.mutation({
            query: () => ({
                url: 'user/protected',
                method: 'GET',
            }),

        }),

        //GET FILES


        getUsers: builder.mutation({
            query: () => ({
                url: 'admin/users',
                method: 'GET'
            })
        }),


        // activate 


        activateUsers: builder.mutation({
            query: (data) => ({
                url: 'user/activate',
                method: 'POST',
                body: data
            })
        }),


        //tender notices

        getTenderNotice: builder.mutation({
            query: () => ({
                url: 'tenderNotice/',
                method: 'GET'
            })
        }),
        addTenderNotice: builder.mutation({
            query: (data) => ({
                url: 'tenderNotice/',
                method: 'POST',
                body: data,

            })
        }),
        editTenderNotice: builder.mutation({
            query: ({ data, id }) => {


                console.log("dataaa", data, "id:", id)
                return ({
                    url: `tenderNotice/${id}`,
                    method: 'PUT',
                    body: data,

                })
            }
        }),
        deleteTenderNotice: builder.mutation({
            query: (id) => ({
                url: `tenderNotice/${id}`,
                method: 'DELETE',

            })
        }),



        // CDC

        updateCdc: builder.mutation({
            query: ({ id, data }) => ({
                url: `cdc/${id}`,
                method: 'PUT',
                body: data
            })
        }),

        //ADD FILE
        addCdc: builder.mutation({
            query: (data) => {
                console.log(data)
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('file', data.file);
                formData.append('deadLine', data.deadLine);
                formData.append('client', data.description);
                formData.append('description', data.client);

                return {
                    url: 'cdc/',
                    method: 'POST',
                    body: formData,

                };
            },
        }),

        //
        removeCdc: builder.mutation({
            query: (id) => ({
                url: `cdc/${id}`,
                method: 'DELETE',
            })
        }),
        getCdcs: builder.mutation({
            query: () => ({
                url: `cdc/`,
                method: 'GET',
            })
        }),

        // GET FILE DATA
        getCdc: builder.mutation({
            query: (id) => ({
                url: `cdc/cdc-data/${id}`,
                method: 'GET',
            })
        }),



        ////////////////////////////////////////////
        getSales: builder.mutation({
            query: () => ({
                url: 'sale',
                method: 'GET'
            })
        }),
        updateSale: builder.mutation({
            query: ({ saleId, data }) => ({
                url: `sale/updatetSale/${saleId}`,
                method: 'PUT',
                body: data
            })
        }),
        addSale: builder.mutation({
            query: (data) => ({
                url: 'sale/addSale',
                method: 'POST',
                body: data,

            })
        },
        ),
        removeSale: builder.mutation({
            query: ({ sales }) => ({
                url: `sale/removeSale`,
                method: 'DELETE',
                body: { saleIds: sales }
            })
        }),

    })

})
export const { useRegisterUserMutation,
    // useUpdateUserMutation,
    useLogInUserMutation,
    useGetUsersMutation,
    useActivateUsersMutation,
    useAddTenderNoticeMutation,
    useEditTenderNoticeMutation,
    useDeleteTenderNoticeMutation,
    useGetTenderNoticeMutation,
    useAddCdcMutation,
    useEditCdcMutation,
    useDeleteCdcMutation,
    useGetCdcMutation,
    useGetCdcsMutation,

    // useGetProtectionMutation,
    // useSignOutUserMutation,
    // useGetUserQuery,
    // useAddProductMutation,
    // useGetProductsMutation,
    // useGetProductMutation,
    // useUpdateProductMutation,
    // useRemoveProductMutation,
    // useAddSaleMutation,
    // useGetSalesMutation,
    // useGetSaleMutation,
    // useUpdateSaleMutation,
    // useRemoveSaleMutation,

} = apiSlice