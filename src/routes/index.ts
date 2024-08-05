import { Router } from "express";
import JobController from "../controllers/JobController"
import CountryController from "../controllers/CountryController";

const router: Router = Router();


router.get("/", (req, res) => res.send({ message: 'Welcome' }));


router.get("/all", JobController.getAllCountriesFromService);


router.get("/countries", CountryController.getAllCountries);

router.get("/countries/regions", CountryController.getRegions);
router.get("/countries/languages", CountryController.getLanguages);
router.get("/countries/statistics", CountryController.getStatistics);

router.get("/countries/:name", CountryController.getCountry);


export default router;