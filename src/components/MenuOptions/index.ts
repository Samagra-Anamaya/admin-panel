import gps from "../../pages/gps";
import villages from "../../pages/villages";
import submissions from "../../pages/submissions";
import transactions from "../../pages/transactions";
import records from "../../pages/records";
import scheme from "../../pages/scheme";
import users from "../../pages/users";
import departments from "../../pages/departments";

const MenuOptions: any[] = [
    {
        name: "GPS",

        icon: "GPSIcon",

        resource: "gps",
        props: gps,
        permissions: ["admin"],
    },
    {
        name: "Villages",
        icon: "villageIcon",
        resource: "villages",
        props: villages,
        permissions: ["admin"],
    },
    {
        name: "Submissions",
        resource: "submissions",
        props: submissions,

        icon: "submissionIcon",

        permissions: ["admin"]
    },
    {
        name: "Transactions",
        resource: "transactions",
        props: transactions,

        icon: "submissionIcon",

        permissions: ["department"]
    },
    {
        name: "Records",
        resource: "records",
        props: records,

        icon: "submissionIcon",

        permissions: ["department"]
    },
    {
        name: "Schemes",
        resource: "scheme",
        props: scheme,

        icon: "submissionIcon",

        permissions: ["department"]
    },
    {
        name: "Users",
        resource: "users",
        props: users,

        icon: "submissionIcon",

        permissions: ["super_admin_department"]
    },
    {
        name: "Departments",
        resource: "departments",
        props: departments,

        icon: "submissionIcon",

        permissions: ["super_admin_department"]
    },
];

export const MenuItemsWithPermissionResolver = (permissions: any) => {
    // Permissions are case In Sensitive
    if (permissions?.length) {
        return MenuOptions.filter((menuOption) => {
            return FilterWithMenuOption(permissions, menuOption);
        });
    }
    return [] as any[];
};

const FilterWithMenuOption = (permissions: string[], menuOption: any) => {
    let found = !menuOption?.permissions?.length;
    const ResourcePermissions: any = {
        canCreate: !!menuOption.props.permissions?.length,
        canDelete: !!menuOption.props.permissions?.length,
        canList: !!menuOption.props.permissions?.length,
        canEdit: !!menuOption.props.permissions?.length,
    };
    if (menuOption.props.permissions) {
        const _p = menuOption.props.permissions;
        for (let i in _p) {
            _p[i].forEach((permission: string) => {
                permissions.forEach((p: string) => {
                    if (permission?.toLowerCase() === p.toLowerCase()) {
                        ResourcePermissions[i] = true;
                    }
                });
            });
        }
    }
    menuOption?.permissions?.forEach((permission: any) => {
        permissions.forEach((p: string) => {
            if (
                permission?.toLowerCase() === p.toLowerCase() &&
                ResourcePermissions.canList
            ) {
                found = true;
            }
        });
    });
    if (!ResourcePermissions.canEdit) {
        delete menuOption.props["edit"];
    }
    if (!ResourcePermissions.canCreate) {
        delete menuOption.props["create"];
    }
    if (!ResourcePermissions.canList) {
        delete menuOption.props["list"];
    }
    return found && menuOption.props
        ? { ...menuOption, resourcePermissions: ResourcePermissions }
        : false;
};
export const ItemWithPermissionResolver = (
    permissions: any,
    resource: string
) => {
    // Permissions are case In Sensitive
    if (permissions?.length && resource) {
        const menuOption = MenuOptions.find(
            (menuOption) =>
                menuOption.resource.toLowerCase() === resource.toLowerCase()
        );
        return FilterWithMenuOption(permissions, menuOption);
    }
    return null;
};
export default MenuOptions;
