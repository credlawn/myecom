import { ArrowDownIcon } from "@/lib/icons";

export const NavItems = () => (
    <div className="flex flex-1 justify-left pl-20">
        <ul className="flex gap-x-3 xl:gap-x-4 xxl:gap-x-5">
        <li className="group relative">
            <a className="flex cursor-pointer items-center gap-1 justify-center" href="/collections/skin-care">
            <p className="text-xs sm:text-sm lg:text-base font-normal !leading-tight text-gray-900 capitalize">Skin</p>
            <ArrowDownIcon />
            </a>
            <div className="invisible absolute left-1/2 z-[99] w-fit min-w-28 pt-3 opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100"
                style={{ transform: 'translateX(-50%)' }}>
            <div className="w-full rounded bg-white-a700_01 p-3 shadow">
                <div className="flex flex-col gap-3">
                <a className="self-center" href="/collections/face-wash-men-and-women">
                    <p className="text-xs md:text-sm font-normal !leading-tight text-gray-900 truncate capitalize">Face Wash</p>
                </a>
                <a className="self-center" href="/collections/face-scrub">
                    <p className="text-xs md:text-sm font-normal !leading-tight text-gray-900 truncate capitalize">Face Scrub</p>
                </a>
                </div>
            </div>
            </div>
        </li>

        <li className="group relative">
            <a className="flex cursor-pointer items-center gap-1 justify-center" href="/collections/hair-care">
            <p className="text-xs sm:text-sm lg:text-base font-normal !leading-tight text-gray-900 capitalize">Hair</p>
            <ArrowDownIcon />
            </a>
            <div className="invisible absolute left-1/2 z-[99] w-fit min-w-28 pt-3 opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100"
                style={{ transform: 'translateX(-50%)' }}>
            <div className="w-full rounded bg-white-a700_01 p-3 shadow">
                <div className="flex flex-col gap-3">
                <a className="self-center" href="/collections/hair-oil">
                    <p className="text-xs md:text-sm font-normal !leading-tight text-gray-900 truncate capitalize">Hair Oil</p>
                </a>
                <a className="self-center" href="/collections/hair-care-kit">
                    <p className="text-xs md:text-sm font-normal !leading-tight text-gray-900 truncate capitalize">Hair Kit</p>
                </a>
                </div>
            </div>
            </div>
        </li>
        </ul>
    </div>
);