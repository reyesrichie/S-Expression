let hasCycle = (currentNode, graph, visitedNodes) => {
    let currentNodeIndex = currentNode.charCodeAt(0) - "A".charCodeAt(0);
    if (visitedNodes[currentNodeIndex]) {
        return true;
    }

    visitedNodes[currentNodeIndex] = true;

    for (let i = 0; i < 26; i++) {
        if (graph[currentNodeIndex] && graph[currentNodeIndex][i]) {
            if (hasCycle(String.fromCharCode(i + "A".charCodeAt(0)), graph, visitedNodes)) {
                return true;
            }
        }
    }

    return false;
};

let RecursiveSExpression = (root, graph) => {
    let left = "";
    let right = "";

    for (let i = 0; i < 26; i++) {
        let leftIndex = root.charCodeAt(0) - "A".charCodeAt(0);

        if (graph[leftIndex][i]) {
            let leftNode = String.fromCharCode(i + "A".charCodeAt(0));
            left = RecursiveSExpression(leftNode, graph);

            for (let j = i + 1; j < 26; j++) {
                let rightIndex = root.charCodeAt(0) - "A".charCodeAt(0);

                if (graph[rightIndex][j]) {
                    let rightNode = String.fromCharCode(j + "A".charCodeAt(0));
                    right = RecursiveSExpression(rightNode, graph);
                    break;
                }
            }

            break;
        }
    }

    return `(${root}${left}${right})`;
};

function SExpression(nodes) {
    let graph = Array(26).fill(false).map(x => Array(26).fill(false));
    let tree = new Set();

    let hasE2Error = false;

    for (let index = 1; index < nodes.length; index += 6) {
        let x = nodes.charCodeAt(index) - "A".charCodeAt(0);
        let y = nodes.charCodeAt(index + 2) - "A".charCodeAt(0);

        if (graph[x][y]) {
            hasE2Error = true;
        }

        graph[x][y] = true;
        tree.add(nodes[index]);
        tree.add(nodes[index + 2]);
    }

    let hasE1Error = graph.map(x => {
       return x.filter(y => {
           return y;
       }).length;
    }).filter(z => {
        return z > 2;
    }).length > 0;

    if (hasE1Error) {
        return "E1";
    }

    if (hasE2Error) {
        return "E2";
    }

    let rootCount = 0;
    let root = null;

    let treeArray = Array.from(tree);

    for (let treeIndex in treeArray) {
        let node = treeArray[treeIndex];
        for (let i = 0; i < 26; i++) {
            let nodeIndex = node.charCodeAt(0) - "A".charCodeAt(0);
            if (graph[i][nodeIndex]) {
                break;
            }

            if (i == 25) {
                rootCount += 1;
                root = node;
                if (hasCycle(node, graph, Array(26).fill(false))) {
                    return "E3";
                }
            }
        }
    }

    if (rootCount == 0) {
        return "E3";
    }

    if (rootCount > 1) {
        return "E4";
    }

    if (root == null) {
        return "E5";
    }

    return RecursiveSExpression(root, graph);
}

let example1 = "(A,B) (A,C) (B,G) (C,H) (E,F) (B,D) (C,E)";
let example2 = "(B,D) (D,E) (A,B) (C,F) (E,G) (A,C)";
let example3 = "(A,B) (A,C) (B,D) (D,C)";

console.log(`${example1} => ${SExpression(example1)}`);
console.log(`${example2} => ${SExpression(example2)}`);
console.log(`${example3} => ${SExpression(example3)}`);
