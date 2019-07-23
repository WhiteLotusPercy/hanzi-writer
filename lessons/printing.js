function PrintElem(elem)
{
    var mywindow = window.open('', 'PRINT', 'height=600,width=900');

    mywindow.document.write('<html><head><title>' + document.title + '</title>');
    mywindow.document.write('<link rel="stylesheet" href="print.css" />');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title + '</h1>');

    //mywindow.document.write('<div class = "page" ><div class = "subpage" >');
    mywindow.document.write('<div class = "page" >');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</div>');
    //mywindow.document.write('</div></div>');

    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}
