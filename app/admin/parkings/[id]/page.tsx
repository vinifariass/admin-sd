import ParkingForm from "@/components/admin/parking-form";
import { getParkingById } from "@/lib/actions/parking.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Update Product',
};
const AdminProductUpdatePage = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const parking = await getParkingById(id);
    if (!parking) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Update Product
            </h1>

            <ParkingForm type="Update" parking={parking} parkingId={parking.id} />
        </div>
    </>);
}

export default AdminProductUpdatePage;