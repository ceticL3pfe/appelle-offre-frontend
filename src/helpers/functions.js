import html2canvas from "html2canvas";
import { setTenders } from "../features/tenders/tender";
import { logOut } from "../features/users/userSlice";
import jsPDF from "jspdf";



export const resetStore = (dispatch) => {
    dispatch(setTenders([]))
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






export const handleDownloadPDF = (startDate,endDate) => {
    const input = document.querySelector('.seles-tab')
    console.log(input, startDate, endDate)

    try {
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('img/png')

            const pdf = new jsPDF('landscape', 'px', 'a4');
            const componentWidth = pdf.internal.pageSize.getWidth()
            const componentHeight = pdf.internal.pageSize.getHeight()
            console.log(componentWidth)
            pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight, '', 'FAST');




            // const fromDate = startDate?.toLocaleDateString('en-US');
            // const toDate = endDate?.toLocaleDateString('en-US');

            // if (fromDate && toDate) {
            //     pdf.save(`sales${fromDate}->${toDate}.pdf`);
            // } else if (fromDate) {
            //     pdf.save(`salesStartingFrom${fromDate}.pdf`);
            // } else if (toDate) {
            //     pdf.save(`salesTill${toDate}.pdf`);
            // } else {
            //     pdf.save(`sales.pdf`);

            // }
            pdf.save(`ao.pdf`);
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
};


export function openPdfInNewPage(pdfData) {
    try{
        // Encode the PDF data as base64 if necessary (assuming it's not already base64 encoded)
        const base64Data = pdfData.startsWith('JVBERi0') ? pdfData : btoa(pdfData);
        const url = `data:application/pdf;base64,${base64Data}`; // Construct data URL for the PDF

        // Open the data URL in a new window
        window.open(url, '_blank');

    }catch(err){
        console.error(err)
    }
   
}
