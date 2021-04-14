import { Injectable } from '@angular/core';
import { Drone, DroneDto } from 'src/app/models/drone.model';
import { map } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
import { DroneMapper } from '../mappers/drone.mapper';
import { DroneZone, ZoneColors } from '../models/drone-zone.model';
import { ToastrService } from 'ngx-toastr';
import { ApiBaseService } from './api-base.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TickService } from './tick.service';

@Injectable({
  providedIn: 'root',
})
export class DroneService extends ApiBaseService<Drone, string> {
  // The list of drones accessible by the system.
  public droneList: Drone[] = [];
  public droneZones: DroneZone[] = [];
  public selectedDroneId = '';
  private usedZoneColors: string[] = [];
  public isDemoLive = false;

  subscription: Subscription;

  constructor(
    protected toastrService: ToastrService,
    protected httpClient: HttpClient,
    private tickService: TickService
  ) {
    // Setup base api.
    super(`${environment.api.baseUrl}/drones`, httpClient, toastrService);

    // Run updateDrones at the given interval (source).
    this.subscription = this.tickService.UpdateClock.subscribe((val) => this.updateDrones());
    this.updateZones();
  }

  /**
   * Updates the drone list from the database.
   * Maps all the data from DroneDta to a Drone model.
   */
  public updateDrones(): void {
    this.getAll()
      .pipe(
        map((drones: DroneDto[]) =>
          drones.map((drone: DroneDto) => new DroneMapper().mapDto(drone))
        )
      )
      .subscribe((data: Drone[]) => {
        if (this.droneList.length == 0) {
          this.droneList = data;
        } else
          data.forEach((nDrone: Drone) => {
            Object.assign(
              this.droneList.find(
                (oDrone: Drone) => oDrone.uuid == nDrone.uuid
              ),
              nDrone
            );
          });
      });
  }

  public getZoneColorFromUuid(uuid: string): string {
    for (const drone of this.droneZones) {
      if (drone.droneUuid === uuid) {
        return drone.zoneColor;
      }
    }

    return '#858585';
  }

  private getRandomZoneColor(): string {
    for (const color in ZoneColors) {
      if (!this.usedZoneColors.includes(color)) {
        this.usedZoneColors.push(color);
        return ZoneColors[color];
      }
    }
  }

  public updateZones(): void {
    this.droneZones.push({
      droneUuid: 'test1',
      zoneColor: this.getRandomZoneColor(),
      area: [
        {
          lat: 57.053047140582784,
          lng: 9.918012921231707,
        },
        {
          lat: 57.05289543002416,
          lng: 9.918421287556763,
        },
        {
          lat: 57.052856772905564,
          lng: 9.918378372212102,
        },
        {
          lat: 57.05201233741617,
          lng: 9.920489437281127,
        },
        {
          lat: 57.05097772395604,
          lng: 9.923082510750682,
        },
        {
          lat: 57.0508695276418,
          lng: 9.923004144677506,
        },
        {
          lat: 57.050725265405056,
          lng: 9.923536632073683,
        },
        {
          lat: 57.0508651560671,
          lng: 9.923695373599335,
        },
        {
          lat: 57.05011330255698,
          lng: 9.926425687797598,
        },
        {
          lat: 57.04992088953463,
          lng: 9.926285584838865,
        },
        {
          lat: 57.04941069613009,
          lng: 9.928378598393076,
        },
        {
          lat: 57.04938927481739,
          lng: 9.92840366062949,
        },
        {
          lat: 57.04904458472307,
          lng: 9.929882332577993,
        },
        {
          lat: 57.04882063181735,
          lng: 9.931199890149538,
        },
        {
          lat: 57.04867262741118,
          lng: 9.933684631852664,
        },
        {
          lat: 57.048820631811665,
          lng: 9.937315075797931,
        },
        {
          lat: 57.049336695174254,
          lng: 9.941274909129522,
        },
        {
          lat: 57.048799210157966,
          lng: 9.941557754354527,
        },
        {
          lat: 57.048454514577976,
          lng: 9.939083753592461,
        },
        {
          lat: 57.04764826497881,
          lng: 9.939405982347832,
        },
        {
          lat: 57.04755673312192,
          lng: 9.942288139535592,
        },
        {
          lat: 57.04811760563733,
          lng: 9.942370486883812,
        },
        {
          lat: 57.04819745138308,
          lng: 9.94290395448751,
        },
        {
          lat: 57.0494262752347,
          lng: 9.942388388481252,
        },
        {
          lat: 57.049681382562156,
          lng: 9.944239413639817,
        },
        {
          lat: 57.049749540705406,
          lng: 9.944518678559874,
        },
        {
          lat: 57.05001438258894,
          lng: 9.944464973767554,
        },
        {
          lat: 57.05001873601876,
          lng: 9.944651604220129,
        },
        {
          lat: 57.0499643143519,
          lng: 9.944749532272535,
        },
        {
          lat: 57.049983998793806,
          lng: 9.94507312061962,
        },
        {
          lat: 57.0500175781118,
          lng: 9.945079507231732,
        },
        {
          lat: 57.050002525317836,
          lng: 9.945260461241613,
        },
        {
          lat: 57.05004709472317,
          lng: 9.945653579648576,
        },
        {
          lat: 57.05007025283744,
          lng: 9.94584662948555,
        },
        {
          lat: 57.050120042734136,
          lng: 9.945953073020775,
        },
        {
          lat: 57.050210359120605,
          lng: 9.945942428667252,
        },
        {
          lat: 57.050218464426585,
          lng: 9.946180862186155,
        },
        {
          lat: 57.05088077774871,
          lng: 9.947754097627907,
        },
        {
          lat: 57.051553499994384,
          lng: 9.94942951886229,
        },
        {
          lat: 57.05215789753978,
          lng: 9.951204997021494,
        },
        {
          lat: 57.052267892201485,
          lng: 9.951038945106541,
        },
        {
          lat: 57.05341397384116,
          lng: 9.953750224863407,
        },
        {
          lat: 57.05460731623114,
          lng: 9.956610389033639,
        },
        {
          lat: 57.054620838735616,
          lng: 9.956681431569669,
        },
        {
          lat: 57.054612338876225,
          lng: 9.956788705799072,
        },
        {
          lat: 57.0545868392864,
          lng: 9.956839145999652,
        },
        {
          lat: 57.05253108886886,
          lng: 9.957596977247004,
        },
        {
          lat: 57.052537047646304,
          lng: 9.957781042361457,
        },
        {
          lat: 57.05286716242249,
          lng: 9.958848181775034,
        },
        {
          lat: 57.05292913310023,
          lng: 9.95894021433226,
        },
        {
          lat: 57.05471880980077,
          lng: 9.958307402636306,
        },
        {
          lat: 57.054801036000256,
          lng: 9.958294255128132,
        },
        {
          lat: 57.054865386811976,
          lng: 9.95834246265811,
        },
        {
          lat: 57.0556471211181,
          lng: 9.959681317235265,
        },
        {
          lat: 57.057758130652275,
          lng: 9.955595386886309,
        },
        {
          lat: 57.05774342921196,
          lng: 9.955514281966892,
        },
        {
          lat: 57.05776364369091,
          lng: 9.955362210242987,
        },
        {
          lat: 57.05839580003265,
          lng: 9.954094945879286,
        },
        {
          lat: 57.058412926204184,
          lng: 9.954012156670595,
        },
        {
          lat: 57.058412926204184,
          lng: 9.953954806832087,
        },
        {
          lat: 57.058402530899976,
          lng: 9.953891483052068,
        },
        {
          lat: 57.05829857769781,
          lng: 9.953654914968228,
        },
        {
          lat: 57.05810236523555,
          lng: 9.953528267408192,
        },
        {
          lat: 57.05805753509035,
          lng: 9.953516319525168,
        },
        {
          lat: 57.057919795754835,
          lng: 9.953574864151978,
        },
        {
          lat: 57.057890558566,
          lng: 9.953550968385933,
        },
        {
          lat: 57.05789055856336,
          lng: 9.95349600812689,
        },
        {
          lat: 57.057889259132196,
          lng: 9.953494813338589,
        },
        {
          lat: 57.057905502018315,
          lng: 9.95343148955857,
        },
        {
          lat: 57.05791784660698,
          lng: 9.95324390779512,
        },
        {
          lat: 57.057933439765684,
          lng: 9.953155493462845,
        },
        {
          lat: 57.057945134630494,
          lng: 9.953030040691111,
        },
        {
          lat: 57.05797762034668,
          lng: 9.952830511044638,
        },
        {
          lat: 57.057980219202776,
          lng: 9.952576021136263,
        },
        {
          lat: 57.05796072777797,
          lng: 9.952277324062083,
        },
        {
          lat: 57.05793798776925,
          lng: 9.952180546209602,
        },
        {
          lat: 57.05794058662632,
          lng: 9.952181741001128,
        },
        {
          lat: 57.057766462681585,
          lng: 9.951687098644003,
        },
        {
          lat: 57.057665106572614,
          lng: 9.951583152064764,
        },
        {
          lat: 57.0576085809323,
          lng: 9.951478010694167,
        },
        {
          lat: 57.057594936799326,
          lng: 9.951395570301313,
        },
        {
          lat: 57.0575741457299,
          lng: 9.951326272579784,
        },
        {
          lat: 57.05754036021729,
          lng: 9.951104041955569,
        },
        {
          lat: 57.05749877800571,
          lng: 9.95099173185516,
        },
        {
          lat: 57.05746629186538,
          lng: 9.950939161175953,
        },
        {
          lat: 57.05742925763656,
          lng: 9.950859110359701,
        },
        {
          lat: 57.05740651730232,
          lng: 9.950756358565709,
        },
        {
          lat: 57.0573623360417,
          lng: 9.9506440484653,
        },
        {
          lat: 57.0573103580207,
          lng: 9.95053173836489,
        },
        {
          lat: 57.05718171210582,
          lng: 9.95030114422256,
        },
        {
          lat: 57.05714272840344,
          lng: 9.950172107090225,
        },
        {
          lat: 57.05698354454001,
          lng: 9.949225834758456,
        },
        {
          lat: 57.05688543496348,
          lng: 9.948850671231556,
        },
        {
          lat: 57.05668271766008,
          lng: 9.9484551963092,
        },
        {
          lat: 57.05662424131094,
          lng: 9.94829031552349,
        },
        {
          lat: 57.05648779613534,
          lng: 9.947718011930744,
        },
        {
          lat: 57.056449461448935,
          lng: 9.947641545479403,
        },
        {
          lat: 57.05638058886207,
          lng: 9.947541183262016,
        },
        {
          lat: 57.05635005097606,
          lng: 9.947455158504255,
        },
        {
          lat: 57.05634753901099,
          lng: 9.946757809747082,
        },
        {
          lat: 57.05621232003021,
          lng: 9.94615110647686,
        },
        {
          lat: 57.056213865390355,
          lng: 9.946151106483022,
        },
        {
          lat: 57.05614973278995,
          lng: 9.946010442258778,
        },
        {
          lat: 57.05597742417041,
          lng: 9.945335538152559,
        },
        {
          lat: 57.05587156601026,
          lng: 9.945092572677682,
        },
        {
          lat: 57.05565907609057,
          lng: 9.944454610694978,
        },
        {
          lat: 57.05556558014275,
          lng: 9.94437788475448,
        },
        {
          lat: 57.05544581226236,
          lng: 9.943873482738251,
        },
        {
          lat: 57.0553554065635,
          lng: 9.94383654062507,
        },
        {
          lat: 57.055299772184455,
          lng: 9.943793915102573,
        },
        {
          lat: 57.05524954663173,
          lng: 9.943724293415825,
        },
        {
          lat: 57.055204729927354,
          lng: 9.94361630875883,
        },
        {
          lat: 57.05517536722964,
          lng: 9.943469961131585,
        },
        {
          lat: 57.055173049120924,
          lng: 9.94335771392234,
        },
        {
          lat: 57.05519313939156,
          lng: 9.942944246354111,
        },
        {
          lat: 57.05518309425454,
          lng: 9.94277800682174,
        },
        {
          lat: 57.055159140462614,
          lng: 9.942625975791495,
        },
        {
          lat: 57.0550880516988,
          lng: 9.942414269029756,
        },
        {
          lat: 57.05503473503664,
          lng: 9.94235743499976,
        },
        {
          lat: 57.05482378575298,
          lng: 9.942211087372517,
        },
        {
          lat: 57.05467819319316,
          lng: 9.941816851212085,
        },
        {
          lat: 57.054669606951734,
          lng: 9.941798807532408,
        },
        {
          lat: 57.0546352619662,
          lng: 9.941656713554952,
        },
        {
          lat: 57.054610116510204,
          lng: 9.941598071596003,
        },
        {
          lat: 57.05457699807879,
          lng: 9.941564239696609,
        },
        {
          lat: 57.05452302723833,
          lng: 9.94156198423665,
        },
        {
          lat: 57.05447150954474,
          lng: 9.941470638108285,
        },
        {
          lat: 57.054472122851024,
          lng: 9.941392824739678,
        },
        {
          lat: 57.054532226818964,
          lng: 9.941048867095839,
        },
        {
          lat: 57.05450462806903,
          lng: 9.940798511046511,
        },
        {
          lat: 57.054519347404224,
          lng: 9.940305693045337,
        },
        {
          lat: 57.05436540739933,
          lng: 9.939611011382192,
        },
        {
          lat: 57.05435436785273,
          lng: 9.93945200145504,
        },
        {
          lat: 57.05435221006049,
          lng: 9.93896186278696,
        },
        {
          lat: 57.054222801784974,
          lng: 9.938494982579353,
        },
        {
          lat: 57.05406088748257,
          lng: 9.938191623218241,
        },
        {
          lat: 57.054004462635945,
          lng: 9.93803599648103,
        },
        {
          lat: 57.053979930067214,
          lng: 9.937904052073392,
        },
        {
          lat: 57.05387382651936,
          lng: 9.93726914009697,
        },
        {
          lat: 57.05383825416423,
          lng: 9.937051488210868,
        },
        {
          lat: 57.05387014662102,
          lng: 9.936800004429605,
        },
        {
          lat: 57.05389038605124,
          lng: 9.936730085170858,
        },
        {
          lat: 57.053901425735816,
          lng: 9.936557542483948,
        },
        {
          lat: 57.05389590589395,
          lng: 9.936421087156392,
        },
        {
          lat: 57.053862786823046,
          lng: 9.936276737723565,
        },
        {
          lat: 57.0537885754698,
          lng: 9.935940674189586,
        },
        {
          lat: 57.053634615330346,
          lng: 9.935577754940022,
        },
        {
          lat: 57.05364013521103,
          lng: 9.935528134820911,
        },
        {
          lat: 57.05357573655166,
          lng: 9.93547964243178,
        },
        {
          lat: 57.05387659957203,
          lng: 9.933942970897085,
        },
        {
          lat: 57.05388710981541,
          lng: 9.93375109503741,
        },
        {
          lat: 57.05539554464419,
          lng: 9.925849564231104,
        },
        {
          lat: 57.055456250849744,
          lng: 9.925731370203035,
        },
        {
          lat: 57.05580977325121,
          lng: 9.923912495437747,
        },
        {
          lat: 57.05556337920565,
          lng: 9.923587461860558,
        },
        {
          lat: 57.05514022039896,
          lng: 9.924746419969125,
        },
        {
          lat: 57.05502594883937,
          lng: 9.924677473452752,
        },
        {
          lat: 57.054929531937404,
          lng: 9.92455271308979,
        },
        {
          lat: 57.05603652574894,
          lng: 9.921528915887011,
        },
        {
          lat: 57.056115115303456,
          lng: 9.921412857336568,
        },
      ],
      path: [],
    });
  }

  /**
   * @param status The status of the drone.
   * @returns      A CSS class with the correct color for the status.
   */
  public getDroneColor(status: number): string {
    switch (status) {
      case 0:
      case 1:
        return 'drone-status-idle';
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 'drone-status-active';
      case 440:
        return 'drone-status-error';
    }
  }

  /**
   * @param status The status of the drone.
   * @returns      A CSS class with the correct color for the status icon.
   */
  public getDroneIconColor(status: number): string {
    switch (status) {
      case 0:
      case 1:
        return 'drone-status-idle-icon';
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 'drone-status-active-icon';
      case 440:
        return 'drone-status-error-icon';
    }
  }

  /**
   * @param status The status of the drone.
   * @returns      A boolean describing if the livefeed should be inaccessible.
   */
  public isLivefeedDisabled(status: number): boolean {
    switch (status) {
      case 0:
      case 1:
        return true;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return false;
      case 440:
        return true;
    }
  }
}
