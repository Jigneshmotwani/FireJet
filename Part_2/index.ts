// Function to merge two intermediate representations
function mergeDesigns(desktopIR: any[], mobileIR: any[]) {
    let responsiveIR: {}[] = [];

    // Step 1: Merge common elements with responsive adaptations
    desktopIR.forEach(desktopNode => {
        let mobileNode = findNodeById(mobileIR, desktopNode.id);
        if (mobileNode) {
            let responsiveNode = mergeNodes(desktopNode, mobileNode);
            responsiveIR.push(responsiveNode);
        } else {
            // Desktop only node, add it with default desktop properties
            responsiveIR.push(applyDefaultBreakpoint(desktopNode, 'desktop'));
        }
    });

    // Step 2: Add unique mobile nodes
    mobileIR.forEach(mobileNode => {
        if (!findNodeById(responsiveIR, mobileNode.id)) {
            responsiveIR.push(applyDefaultBreakpoint(mobileNode, 'mobile'));
        }
    });

    return responsiveIR;
}

// Function to merge properties of two nodes
function mergeNodes(desktopNode: { id: any; name: any; visible: any; style: { common: any; desktop: any; }; children: any[]; }, mobileNode: { visible: any; style: { common: any; mobile: any; }; children: any[]; }) {
    let mergedNode: { id: any; name: any; visible: any; style: { common: any; desktop: any; mobile: any; }; children: any[]; };

    // Merge basic properties
    mergedNode = {
        id: desktopNode.id,
        name: desktopNode.name,
        visible: desktopNode.visible && mobileNode.visible,
        style: {
            common: { ...desktopNode.style.common, ...mobileNode.style.common },
            desktop: { ...desktopNode.style.desktop },
            mobile: { ...mobileNode.style.mobile }
        },
        children: []
    };

    // Merge children recursively
    if (desktopNode.children && mobileNode.children) {
        mergedNode.children = mergeDesigns(desktopNode.children, mobileNode.children);
    }

    return mergedNode;
}

// Function to apply default breakpoint styles
function applyDefaultBreakpoint(node: { style: { common: any; }; }, breakpoint: string) {
    let styledNode = { ...node };
    styledNode.style = {
        common: { ...node.style.common },
        [breakpoint]: { ...node.style }
    };
    return styledNode;
}

// Helper function to find a node by ID
function findNodeById(ir: any[], id: any) {
    for (let node of ir) {
        if (node.id === id) return node;
    }
    return null;
}
