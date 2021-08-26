let board = document.getElementById('board');
let selectedBlock = null;
let lastBlock = null;

let gameLayout = [
    ['a', 'c', 'b', 'c'],
    ['d', 'a', 'b', 'c'],
    ['d', 'b', 'a', 'c'],
    ['d', 'd', 'b', 'a'],
    ['', '', '', ''],
    ['', '', '', ''],
]

/**
 * Create board
 */
function createBoard() {
    for (let y = 0; y < gameLayout.length; y++) {
        let row = document.createElement('div');

        row.setAttribute('data-block', y);
        row.classList.add('block')
        board.appendChild(row);

        for (let x = 0; x < gameLayout[y].length; x++) {
            let item = document.createElement('div');
            item.setAttribute('data-item', gameLayout[y][x]);
            item.classList.add('item');
            row.appendChild(item);
        }
    }
}
createBoard()


/**
 * Main
 */

// Set click event to all blocks
let blocks = document.querySelectorAll('.block');
blocks.forEach(function (item) {
    item.addEventListener('click', function () {

        // if next selected block same -> unset
        if(selectedBlock === this) {
            lastBlock = null;
            selectedBlock = null;
            removeBlocksSetStyle();
        }

        else {
            lastBlock = selectedBlock;
            selectedBlock = this;

            // set only to selected box "set" css class
            removeBlocksSetStyle();
            selectedBlock.classList.add('set');


            // check if is in target box empty items
            if(getCountBlockNullItems(selectedBlock) > 0) {

                // check if last box is defined
                if(lastBlock) {

                    // fill actual block with items and return how many items left in last block
                    let numberToRemove = fillBlock(selectedBlock, selectItemsFromBlock(lastBlock));

                    // remove from last box specific number of items
                    removeFromBlock(lastBlock, numberToRemove);

                    // unset all
                    lastBlock = null;
                    selectedBlock = null;
                    removeBlocksSetStyle();
                }
            }

        }

    })
})

/**
 * Remove class 'set' from all blocks
 */
function removeBlocksSetStyle() {
    blocks.forEach(function (item) {
        item.classList.remove('set');
    });
}

/**
 * Return items from block:
 * - items with same value
 * - only first items from beginning of block
 * - or only fist same items after last null
 * @param selectedBlock object
 * @returns {*[]} array
 */
function selectItemsFromBlock(selectedBlock) {

    let items = selectedBlock.childNodes;
    let itemsArray = [];
    items.forEach(function (item) {
        let attr = item.getAttribute('data-item');
        itemsArray.push(attr);
    })
    itemsArray = itemsArray.reverse();

    let lastItem = null;
    let selectedItems = [];

    itemsArray.forEach(function (item) {

        if(item !== '') {

            // if last item not same as previous
            if (lastItem !== item) {
                selectedItems = [];
            }

            if (
                selectedItems.length === 0 || // if selected items is empty
                lastItem === item // if last item is same as actual item
            ) {
                selectedItems.push(item);
            }

            lastItem = item;
        }

    });

    return selectedItems;
}

/**
 * Return count empty items in specific block
 * @param block object
 * @returns {number} integer
 */
function getCountBlockNullItems(block) {
    let counter = 0;
    let items = block.childNodes;
    items.forEach(function (item) {
        if(item.getAttribute('data-item') === '') {
            counter++;
        }
    })
    return counter;
}

/**
 * Fill target block with item and return number of filled items
 * @param block object
 * @param items array
 * @returns {number} integer - return number of filled items
 */
function fillBlock(block, items) {
    // get array of items from block
    let blockItemsArray = [];
    let selectedBlockItems = block.childNodes;
    selectedBlockItems.forEach(function (item) {
        blockItemsArray.push(item);
    })
    // reverse the array
    blockItemsArray = blockItemsArray.reverse();

    // fill block
    let counter = 0;
    let lastItem = null;
    blockItemsArray.forEach(function (item) {

        if(item.getAttribute('data-item') !== '') {
            lastItem = item;
        }

        if(item.getAttribute('data-item') === '') {

            // allow only if last item is same lake new on null
            if(lastItem === null || lastItem.getAttribute('data-item') === items[counter]) {

                if(counter < items.length) {
                    item.setAttribute('data-item', items[counter]);
                    counter++;
                }
            }

        }
    })

    return counter;
}

/**
 * Remove from block object specific number of items
 * @param block object
 * @param number integer
 */
function removeFromBlock(block, number) {
    // get array of items from block
    let blockItemsArray = [];
    let selectedBlockItems = block.childNodes;
    selectedBlockItems.forEach(function (item) {
        blockItemsArray.push(item);
    })

    // remove specific number of items from array
    let counter = 1;
    blockItemsArray.forEach(function (item) {
        if(item.getAttribute('data-item') !== '') {
            if(counter <= number) {
                item.setAttribute('data-item', '');
                counter++;
            }
        }
    })
}
