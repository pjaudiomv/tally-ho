<script lang="ts">
    import { onMount } from 'svelte';
    import { TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';

    import paginationData from '../utils/advancedTable.json';
    import {
        PlusOutline,
        ChevronDownOutline,
        FilterSolid,
        ChevronRightOutline,
        ChevronLeftOutline
    } from 'flowbite-svelte-icons';

    let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
    let innerDivClass = 'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
    let searchClass = 'w-full md:w-1/2 relative';
    let svgDivClass = 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
    let classInput = "text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

    let searchTerm = '';
    let currentPosition = 0;
    const itemsPerPage = 10;
    const showPage = 5;
    let totalPages = 0;
    let pagesToShow = [];
    let totalItems = paginationData.length;
    let startPage;
    let endPage;

    const updateDataAndPagination = () => {
        const currentPageItems = filteredItems.slice(currentPosition, currentPosition + itemsPerPage);
        renderPagination(filteredItems.length);
    };

    const loadNextPage = () => {
        if (currentPosition + itemsPerPage < filteredItems.length) {
            currentPosition += itemsPerPage;
            updateDataAndPagination();
        }
    };

    const loadPreviousPage = () => {
        if (currentPosition - itemsPerPage >= 0) {
            currentPosition -= itemsPerPage;
            updateDataAndPagination();
        }
    };

    const renderPagination = (totalItems) => {
        totalPages = Math.ceil(totalItems / itemsPerPage);
        const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

        startPage = currentPage - Math.floor(showPage / 2);
        startPage = Math.max(1, startPage);
        endPage = Math.min(startPage + showPage - 1, totalPages);

        pagesToShow = Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
    };

    const goToPage = (pageNumber) => {
        currentPosition = (pageNumber - 1) * itemsPerPage;
        updateDataAndPagination();
    };

    $: startRange = currentPosition + 1;
    $: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

    onMount(() => {
        renderPagination(filteredItems.length);
    });

    $: filteredItems = paginationData.filter((item) => item.product_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    $: currentPageItems = filteredItems.slice(currentPosition, currentPosition + itemsPerPage);

    $: {
        currentPosition = 0; // Reset to the first page when searchTerm changes
        renderPagination(filteredItems.length);
    }
</script>


    <TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass}
                 {searchClass} {classInput}>
        <div slot="header"
             class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <Button>
                <PlusOutline class="h-3.5 w-3.5 mr-2"/>
                Add product
            </Button>
            <Button color='alternative'>Actions
                <ChevronDownOutline class="w-3 h-3 ml-2 "/>
            </Button>
            <Dropdown class="w-44 divide-y divide-gray-100">
                <DropdownItem>Mass Edit</DropdownItem>
                <DropdownItem>Delete all</DropdownItem>
            </Dropdown>
            <Button color='alternative'>Filter
                <FilterSolid class="w-3 h-3 ml-2 "/>
            </Button>
            <Dropdown class="w-48 p-3 space-y-2 text-sm">
                <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose brand</h6>
                <li>
                    <Checkbox>Apple (56)</Checkbox>
                </li>
                <li>
                    <Checkbox>Microsoft (16)</Checkbox>
                </li>
                <li>
                    <Checkbox>Razor (49)</Checkbox>
                </li>
                <li>
                    <Checkbox>Nikon (12)</Checkbox>
                </li>
                <li>
                    <Checkbox>BenQ (74)</Checkbox>
                </li>
            </Dropdown>
        </div>
        <TableHead>
            <TableHeadCell padding="px-4 py-3" scope="col">Product name</TableHeadCell>
            <TableHeadCell padding="px-4 py-3" scope="col">Brand</TableHeadCell>
            <TableHeadCell padding="px-4 py-3" scope="col">Category</TableHeadCell>
            <TableHeadCell padding="px-4 py-3" scope="col">Price</TableHeadCell>
        </TableHead>
        <TableBody class="divide-y">
            {#each currentPageItems as item (item.id)}
                <TableBodyRow>
                    <TableBodyCell tdClass="px-4 py-3">{item.product_name}</TableBodyCell>
                    <TableBodyCell tdClass="px-4 py-3">{item.brand}</TableBodyCell>
                    <TableBodyCell tdClass="px-4 py-3">{item.category}</TableBodyCell>
                    <TableBodyCell tdClass="px-4 py-3">{item.price}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
        <div slot="footer"
             class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
             aria-label="Table navigation">
      <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{filteredItems.length}</span>
      </span>
            <ButtonGroup>
                <Button on:click={loadPreviousPage} disabled={currentPosition === 0}>
                    <ChevronLeftOutline size='xs' class='m-1.5'/>
                </Button>
                {#each pagesToShow as pageNumber}
                    <Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
                {/each}
                <Button on:click={loadNextPage} disabled={ currentPosition + itemsPerPage >= filteredItems.length }>
                    <ChevronRightOutline size='xs' class='m-1.5'/>
                </Button>
            </ButtonGroup>
        </div>
    </TableSearch>
