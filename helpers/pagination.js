module.exports = (objectPagination,query, countRecords) =>{
    //test api thì truyền ?page=1 ,... 
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);
    }
    //tương tự test api thì truyền ?limit = 3 ,...
    if(query.limit){
        objectPagination.limitItems = parseInt(query.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    const totalPage = Math.ceil(countRecords/objectPagination.limitItems);

    objectPagination.totalPage = totalPage;
    return objectPagination;
}