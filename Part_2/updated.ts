// Function to merge two intermediate representations
function mergeDesigns_updated(desktopIR: any[], mobileIR: any[]) {
    let responsiveIR: {}[] = [];

    // Step 1: Merge common elements with responsive adaptations
    desktopIR.forEach(desktopNode => {
        let mobileNode = findNodeById(mobileIR, desktopNode.id);
        if (mobileNode) {
            let responsiveNode = mergeNodes_updated(desktopNode, mobileNode);
            responsiveIR.push(responsiveNode);
        } else {
            // Desktop only node, add it with default desktop properties
            responsiveIR.push(applyDefaultBreakpoint_updated(desktopNode, 'desktop'));
        }
    });

    // Step 2: Add unique mobile nodes
    mobileIR.forEach(mobileNode => {
        if (!findNodeById_updated(responsiveIR, mobileNode.id)) {
            responsiveIR.push(applyDefaultBreakpoint_updated(mobileNode, 'mobile'));
        }
    });

    return responsiveIR;
}

// Function to merge properties of two nodes
function mergeNodes_updated(desktopNode: { id: any; name: any; visible: any; style: { common: any; desktop: any; }; children: any[]; }, mobileNode: { visible: any; style: { common: any; mobile: any; }; children: any[]; }) {
    let mergedNode: { id: any; name: any; visible: any; style: { common: any; desktop: any; mobile: any; }; children: any[]; };

    // Merge basic properties
    mergedNode = {
        id: desktopNode.id,
        name: desktopNode.name,
        visible: desktopNode.visible && mobileNode.visible,
        style: {
            common: {},
            desktop: {},
            mobile: {}
        },
        children: []
    };

    // Determine common properties
    for (let property in desktopNode.style.common) {
        if (isCommonProperty(desktopNode.style.common[property], mobileNode.style.common[property])) {
            mergedNode.style.common[property] = desktopNode.style.common[property];
        } else {
            mergedNode.style.desktop[property] = desktopNode.style.common[property];
            mergedNode.style.mobile[property] = mobileNode.style.common[property];
        }
    }

    // Add specific desktop properties
    for (let property in desktopNode.style.desktop) {
        mergedNode.style.desktop[property] = desktopNode.style.desktop[property];
    }

    // Add specific mobile properties
    for (let property in mobileNode.style.mobile) {
        mergedNode.style.mobile[property] = mobileNode.style.mobile[property];
    }

    // Merge children recursively
    if (desktopNode.children && mobileNode.children) {
        mergedNode.children = mergeDesigns_updated(desktopNode.children, mobileNode.children);
    }

    return mergedNode;
}

function isCommonProperty(desktopProperty: any, mobileProperty: any): boolean {
    return JSON.stringify(desktopProperty) === JSON.stringify(mobileProperty);
}

// Function to apply default breakpoint styles
function applyDefaultBreakpoint_updated(node: { style: { common: any; }; }, breakpoint: string) {
    let styledNode = { ...node };
    styledNode.style = {
        common: { ...node.style.common },
        [breakpoint]: { ...node.style }
    };
    return styledNode;
}

// Helper function to find a node by ID
function findNodeById_updated(ir: any[], id: any) {
    for (let node of ir) {
        if (node.id === id) return node;
    }
    return null;
}


// Desktop and mobile will have different structures so if one element in Desktop is nested within a different parent element in mobile, then we have to dcide where does the element go in the responsive IR.

// To solve this problem, we can build a map of all the elements IDs to their path in the hiearchy whilewill help determin the parent-child relationship for both desktop and mobile IRs. The mergeNode function should now use the desktop path and mobile path while merging the elements into a new IR.