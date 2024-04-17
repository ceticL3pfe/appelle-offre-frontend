import html2canvas from "html2canvas";
import { setProduct } from "../features/products/productSlice";
import { setSaleToStore } from "../features/sales/saleSlice";
import { logOut } from "../features/users/userSlice";
import jsPDF from "jspdf";

export const convertFileToBase64 = (e, setSelectedImage) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
        setSelectedImage(reader.result)
    }
    reader.onerror = (error) => {
        console.log(error)
    }

};


export const resetStore = (dispatch) => {
    dispatch(setSaleToStore([]))
    dispatch(setProduct([]))
    dispatch(logOut())

}
export const getUserData = ({ userId, allUsers }) => {


    const user = allUsers.filter(USER => (USER._id === userId))
    return user[0]
}



export const calculateFond = (products,) => {
    let fond = 0;
    products.map((item) => {
        if (item.count !== 0)
            fond = fond + item.buyPrice * item.count;

    })
    return fond


}
export const calculateGains = (sales, day = null, month = null, year = null) => {

    let date
    let stopDate

    if (day) {
        date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        stopDate = new Date();
        stopDate.setDate(new Date().getDate() + 1)
        stopDate.setHours(0)
        stopDate.setMinutes(0)
        stopDate.setSeconds(0)

        stopDate = Date.parse(stopDate)

        date = Date.parse(date)

        console.log('day')

        //         console.log(date)
    } else if (month) {

        date = new Date()
        date.setDate(1)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        // date = Date.parse(date)
        stopDate = new Date()
        stopDate.setMonth(new Date().getMonth() + 1)
        stopDate.setDate(1)
        stopDate.setHours(0)
        stopDate.setMinutes(0)
        stopDate.setSeconds(0)

        date = Date.parse(date)
        stopDate = Date.parse(stopDate)
        console.log('month')

        // console.log(stopDate)
        // console.log(date)

        // date = Date.parse(new Date().toLocaleDateString())

    } else if (year) {
        // date = 
        date = new Date()
        date.setMonth(0)
        date.setDate(1)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        stopDate = new Date()
        stopDate.setFullYear(new Date().getFullYear() + 1)
        stopDate.setMonth(0)
        stopDate.setDate(1)
        stopDate.setHours(0)
        stopDate.setMinutes(0)
        stopDate.setSeconds(0)
        date = Date.parse(date)
        stopDate = Date.parse(stopDate)

        console.log('year')

        // console.log(stopDate)
        // console.log(date)
    }

    let gains = null;
    let fayda = null
    console.log(date, stopDate)

    // Wait until both date and stopDate have valid values


if(date&&stopDate)
{
    sales.map((sale) => {

        if (Date.parse(sale.createdAt) >= date && Date.parse(sale.createdAt) < stopDate) {

            gains = gains + sale.price * sale.count;
            fayda = fayda + (sale.price - sale.buyPrice) * sale.count
        } else {

            console.log(sale.saleName)
            // console.log( sale.createdAt.toLocaleDateString('en-US'))
            console.log('false', 'createdAt', Date.parse(sale.createdAt), 'date:', date, 'stopDate', stopDate)
            console.log('false', 'createdAt', Date.parse(sale.createdAt) >= date, Date.parse(sale.createdAt) < stopDate)
        }
    })
    console.log(fayda, gains)
    return { gains, fayda }}

    else{
        return false
    }


}

export const handleDownloadPDF = (startDate,endDate) => {
    const input = document.querySelector('.seles-tab')
    console.log(input)

    try {
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('img/png')

            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const componentWidth = pdf.internal.pageSize.getWidth()
            const componentHeight = pdf.internal.pageSize.getHeight()
            console.log(componentWidth)
            pdf.addImage(imgData, 0, 0, componentWidth, componentHeight)




            const fromDate = startDate?.toLocaleDateString('en-US');
            const toDate = endDate?.toLocaleDateString('en-US');

            if (fromDate && toDate) {
                pdf.save(`sales${fromDate}->${toDate}.pdf`);
            } else if (fromDate) {
                pdf.save(`salesStartingFrom${fromDate}.pdf`);
            } else if (toDate) {
                pdf.save(`salesTill${toDate}.pdf`);
            } else {
                pdf.save(`sales.pdf`);

            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};
