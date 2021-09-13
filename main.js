// Settings
const randStep = 500;
const layout = [
    ['a', 'a', 'a', 'a',],
    ['b', 'b', 'b', 'b',],
    ['c', 'c', 'c', 'c',],
    ['d', 'd', 'd', 'd',],
    ['e', 'e', 'e', 'e',],
    ['f', 'f', 'f', 'f',],
    [ '',  '',  '',  '',],
];


// Global variables
let selectedBlock = null;
let lastBlock = null;
let lastLayout = layout;

const board = document.getElementById('board');


createBoard(layout);

/**
 * Create DOM board
 */
function createBoard(layout) {

    board.innerHTML = '';

    let gameLayout = layout;

    let result = document.createElement('div');
    result.setAttribute('id', 'result');
    board.appendChild(result);

    let table = document.createElement('div');
    table.classList.add('table');
    board.appendChild(table);

    let nav = document.createElement('div');
    nav.setAttribute('class', 'nav');
    board.appendChild(nav);

    let rand = document.createElement('div');
    rand.setAttribute('id', 'rand');
    rand.innerHTML = 'New game';
    nav.appendChild(rand);

    let reset = document.createElement('div');
    reset.setAttribute('id', 'reset');
    reset.innerHTML = 'Reset';
    nav.appendChild(reset);

    let restart = document.createElement('div');
    restart.setAttribute('id', 'restart');
    restart.innerHTML = 'Restart last game';
    nav.appendChild(restart);

    for (let x = 0; x < gameLayout.length; x++) {
        let row = document.createElement('div');

        row.setAttribute('data-block', x);
        row.classList.add('block')
        table.appendChild(row);

        for (let y = 0; y < gameLayout[y].length; y++) {
            let item = document.createElement('div');
            item.setAttribute('data-item', gameLayout[x][y]);
            item.classList.add('item');
            row.appendChild(item);
        }
    }

    init();
}


/**
 * Main init function
 */
function init() {

    let blocks = document.querySelectorAll('.block');

    /**
     * Remove class 'set' from all blocks
     */
    function removeBlocksSetStyle() {
        blocks.forEach(function (item) {
            item.classList.remove('set');
        });
    }

    // Set click event to all blocks
    blocks.forEach(function (item) {
        item.addEventListener('click', function () {

            // if next selected block same -> unset
            if (selectedBlock === this) {
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
                if (getCountBlockNullItems(selectedBlock) > 0) {

                    // check if last box is defined
                    if (lastBlock) {

                        // fill actual block with items and return how many items left in last block
                        let numberToRemove = fillBlock(selectedBlock, selectItemsFromBlock(lastBlock));

                        // remove from last box specific number of items
                        removeFromBlock(lastBlock, numberToRemove);

                        // unset all
                        lastBlock = null;
                        selectedBlock = null;
                        removeBlocksSetStyle();

                        checkResult();
                    }
                }

            }

        })
    })

    let resetCta = document.getElementById('reset');
    resetCta.addEventListener('click', function () {
        createBoard(layout);
    });

    let restartCta = document.getElementById('restart');
    restartCta.addEventListener('click', function () {
        createBoard(lastLayout);
    });

    const playRandCta = document.getElementById('rand');
    playRandCta.addEventListener('click', shuffle);

    // const ctasolution = document.getElementById('solution');
    // ctasolution.addEventListener('click', solution);
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
    let blockItemsArray = getItemsArrayFromBlock(block);

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
    let blockItemsArray = getItemsArrayFromBlock(block);

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

/**
 * Get array of items from block
 * @param block object
 * @returns {*[]} array of objects
 */
function getItemsArrayFromBlock(block) {
    return Array.from(block.childNodes)
}

/**
 * Check if all items in all blocks have same number
 */
function checkResult() {
    let allSame = true;

    const allEqual = arr => arr.every( v => v === arr[0] )

    let blocks = document.querySelectorAll('.block');
    blocks.forEach(function (block) {
        let items = getItemsArrayFromBlock(block);
        let itemsArray = [];
        items.forEach(function (item) {
            itemsArray.push(item.getAttribute('data-item'));
        });
        if(!allEqual(itemsArray)) allSame = false;
    })

    // Show text if all block are same
    let resultElement = document.getElementById('result');
    if(allSame) {
        resultElement.innerHTML = 'Success!';
    } else {
        resultElement.innerHTML = '';
    }
}

/**
 * Shuffle
 */
function shuffle() {

    createBoard(layout);

    function mix() {


        // selected block
        // target block

        // select all blocks
        let blocks = document.querySelectorAll('.block');

        // get all block with unless one filled item
        let filteredBlocks = [];
        blocks.forEach(function (block) {
            let blockItems = block.childNodes;
            let hasItem = false;
            blockItems.forEach(function (item) {
                let dataItem = item.getAttribute('data-item');
                if(dataItem !== '') hasItem = true;
            });
            if(hasItem) filteredBlocks.push(block);
        });

        // get random block
        let selectedBlock = filteredBlocks[Math.floor(Math.random()*filteredBlocks.length)];

        // get all block with unless one empty item - except selectedBlock
        let blocksWithEmptyItem = [];
        blocks.forEach(function (block) {
            let blockItems = block.childNodes;
            let hasEmptyItems = false;

            // check if this block not match with selectedBlock
            if(block.getAttribute('data-block') !== selectedBlock.getAttribute('data-block')) {

                blockItems.forEach(function (item) {
                    if (item.getAttribute('data-item') === '') hasEmptyItems = true;
                });

                if (hasEmptyItems) blocksWithEmptyItem.push(block);

            }
        });

        // get random target block
        let randTargetBlock = blocksWithEmptyItem[Math.floor(Math.random()*blocksWithEmptyItem.length)];

        // get items from selectedBlock
        let itemsFromRandBlock = selectItemsFromBlock(selectedBlock);

        // get target items in reverse order
        let targetItems = getItemsArrayFromBlock(randTargetBlock).reverse();

        // get int number of empty item in target block
        let targetCountEmptyItems = getCountBlockNullItems(randTargetBlock);

        // bool - if randTargetBlock empty
        let targetBlockIsEmpty = targetCountEmptyItems === targetItems.length;

        // get int number of all items in target block
        let countItemsFromRandBlock = itemsFromRandBlock.length;

        /**
         * bool - if in block is only one variation of items
         * @param block
         * @returns {boolean}
         */
        function isSingleVariationInBlock(block) {
            let isSingleVariation = true;
            let lastVariation = null;
            let items = getItemsArrayFromBlock(block);
            items.forEach(function (item) {
                let variation = item.getAttribute('data-item');
                if(lastVariation === null) {
                    lastVariation = variation;
                } else if(lastVariation !== variation) {
                    isSingleVariation = false;
                }
            })
            return isSingleVariation;
        }


        let allowedNumberOfItemsToMove = 0;

        // can take only if block have only one color or target block is empty
        if(isSingleVariationInBlock(selectedBlock) || targetBlockIsEmpty) {
            allowedNumberOfItemsToMove = Math.floor(Math.random()*countItemsFromRandBlock);
        }
        else {
            allowedNumberOfItemsToMove = countItemsFromRandBlock - 1;
            if(allowedNumberOfItemsToMove >= 1 ) {
                allowedNumberOfItemsToMove = Math.floor(Math.random()*allowedNumberOfItemsToMove)
            }
            else {
                allowedNumberOfItemsToMove = 0
            }
        }

        // move items
        if(allowedNumberOfItemsToMove > 0) {
            let counter = 1;
            targetItems.forEach(function (item) {
                if (item.getAttribute('data-item') === '' && counter <= allowedNumberOfItemsToMove) {
                    item.setAttribute('data-item', itemsFromRandBlock[counter]);
                    removeFromBlock(selectedBlock, 1);
                    counter++;
                }
            })
        }

    }

    // loop
    (function loop(i) {
        mix();
        if (--i) loop(i);   //  decrement i and call myLoop again if i > 0
    })(randStep);

    lastLayout = mapLayout();

    checkResult();
}

/**
 * Map layout
 * - return attribute data-item items in array
 * @returns {*[]}
 */
function mapLayout() {
    let layout = [];
    let blocks = document.querySelectorAll('.block');
    blocks.forEach(function (block) {
        let items = block.childNodes;
        let itemsArray = [];
        items.forEach(function (item) {
            itemsArray.push(item.getAttribute('data-item'));
        })
        layout.push(itemsArray)
    })
    return layout;
}
mapLayout();










function solution() {

    function mix() {

        // select all blocks
        let blocks = document.querySelectorAll('.block');

        // get all block with unless one item
        let filteredBlocks = [];
        blocks.forEach(function (block) {
            let blockItems = block.childNodes;
            let hasItem = false;
            blockItems.forEach(function (item) {
                let dataItem = item.getAttribute('data-item');
                if(dataItem !== '') hasItem = true;
            });
            if(hasItem) {
                filteredBlocks.push(block);
            }
        });

        // get random block
        let randBlock = filteredBlocks[Math.floor(Math.random()*filteredBlocks.length)];

        // get all block with unless one empty item
        let blocksWithEmptyItem = [];
        blocks.forEach(function (block) {
            let blockItems = block.childNodes;
            let hasEmptyItems = false;

            // check if this block not match with randBlock
            if(block.getAttribute('data-block') !== randBlock.getAttribute('data-block')) {

                blockItems.forEach(function (item) {
                    if (item.getAttribute('data-item') === '') hasEmptyItems = true;
                });

                if (hasEmptyItems) blocksWithEmptyItem.push(block);

            }
        });

        // get random target block
        let randTargetBlock = blocksWithEmptyItem[Math.floor(Math.random()*blocksWithEmptyItem.length)];

        // get items from randBlock
        let itemsFromRandBlock = selectItemsFromBlock(randBlock);



        let numberToRemove = fillBlock(randTargetBlock, itemsFromRandBlock);
        removeFromBlock(randBlock, numberToRemove);


    }

    // loop
    // todo - main.js:459 Uncaught RangeError: Maximum call stack size exceeded
    // 5 x 5000 loops error
    (function loop(i) {
        mix();
        if (--i) loop(i);   //  decrement i and call myLoop again if i > 0
    })(1000);
}
