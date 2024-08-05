import { Router } from "express";
import JobController from "../controllers/JobController"
import CountryController from "../controllers/CountryController";

const router: Router = Router();


router.get("/", (req, res) => res.send({ message: 'Welcome' }));


router.get("/job/allCountries", JobController.getAllCountriesFromService);


router.get("/countries", CountryController.getCountries);
router.get("/countries/:name", CountryController.getCountry);


router.get("/regions", CountryController.getRegions);
router.get("/languages", CountryController.getLanguages);
router.get("/statistics", CountryController.getStatistics);


export default router;